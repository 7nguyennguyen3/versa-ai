import { storage, db } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // Validate content type
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    // Validate authorization header
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("pdf") as File;
    const userId = formData.get("userId") as string;
    const pdfName = formData.get("pdfName") as string;

    // Validate required fields
    if (!userId || !pdfName || !file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2); // Convert to MB
    const userData = userDoc.data();
    if (!userData) {
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 }
      );
    }

    if (
      userData.monthlyUploadUsage + fileSizeMB >
      userData.monthlyUploadLimit
    ) {
      return NextResponse.json(
        {
          error: "Monthly upload limit exceeded",
          limit: userData.monthlyUploadLimit,
          usage: userData.monthlyUploadUsage,
          remaining: userData.monthlyUploadLimit - userData.monthlyUploadUsage,
        },
        { status: 403 }
      );
    }
    // Generate unique PDF ID
    const pdfId = uuidv4();

    // Upload to Firebase Storage
    const fileBuffer = await file.arrayBuffer();
    const shortUserId = userId.slice(-6);
    const shortenedPdfId = pdfId.slice(-6);
    const fileName = `pdfs/${shortUserId}/${shortenedPdfId}.pdf`;

    const bucket = storage.bucket();
    const fileUpload = bucket.file(fileName);
    await fileUpload.save(Buffer.from(fileBuffer), {
      metadata: {
        contentType: "application/pdf",
        cacheControl: "public, max-age=31536000", // Cache for 1 year
      },
    });

    await fileUpload.makePublic();

    const pdfUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;

    // Store metadata in Firestore
    const pdfDoc = {
      pdfId,
      userId,
      pdfName,
      pdfUrl,
      uploadedAt: new Date().toISOString(),
      ingestionStatus: "pending", // Add ingestion status
      fileSizeMB,
    };

    await db.collection("pdfs").doc(pdfId).set(pdfDoc);

    // Update the cacheBuster for the user
    await userRef.update({
      monthlyUploadUsage: FieldValue.increment(Number(fileSizeMB)),
      cacheBuster: Date.now(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Background task to send to Python backend
    const pythonApiUrl = `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/upsert_pdf`;
    const maxRetries = 3;

    const sendToPythonBackend = async () => {
      let retryCount = 0;
      while (retryCount < maxRetries) {
        try {
          const response = await axios.post(
            pythonApiUrl,
            { pdfId, userId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Update Firestore with ingestion status
          await db.collection("pdfs").doc(pdfId).update({
            ingestionStatus: "success",
            ingestionResponse: response.data,
          });
          return;
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) {
            // Mark as failed after max retries
            await db
              .collection("pdfs")
              .doc(pdfId)
              .update({
                ingestionStatus: "failed",
                ingestionError:
                  error instanceof Error ? error.message : "Unknown error",
              });
          } else {
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }
      }
    };

    // Start background task WITHOUT waiting
    sendToPythonBackend();

    // Return response immediately
    return NextResponse.json({
      pdfId,
      userId,
      pdfName,
      pdfUrl,
      message: "PDF uploaded successfully. Processing in the background...",
      fileSizeMB,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
