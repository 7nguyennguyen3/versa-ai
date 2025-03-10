import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
// import { sendEmail } from "@/lib/email";

export async function PUT(request: NextRequest) {
  try {
    const { userId, password, email } = await request.json();

    // Validate input
    if (!userId || !password || !email) {
      return NextResponse.json(
        { error: "User ID, password, and email are required." },
        { status: 400 }
      );
    }

    // Get user document
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    // Verify email
    if (userData?.email !== email) {
      return NextResponse.json(
        { error: "Email does not match our records." },
        { status: 400 }
      );
    }

    // Verify password
    if (!userData?.password) {
      return NextResponse.json(
        { error: "Password not found for user" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Password is incorrect" },
        { status: 400 }
      );
    }

    // Generate a unique deletion token
    const deletionToken = uuidv4();
    const tokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes from now

    // Store the deletion token in the user document
    await userRef.update({
      deletionToken,
      tokenExpires,
    });

    // Send confirmation email
    // const confirmationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/confirm-deletion?token=${deletionToken}`;

    // await sendEmail({
    //   to: email,
    //   subject: "Confirm Account Deletion",
    //   html: `
    //     <p>You have requested to delete your account. Please confirm by clicking the link below:</p>
    //     <p><a href="${confirmationLink}">Confirm Account Deletion</a></p>
    //     <p>This link will expire in 15 minutes.</p>
    //   `,
    // });

    return NextResponse.json(
      {
        message:
          "A confirmation email has been sent. Please check your inbox to complete account deletion.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to initiate account deletion. Please try again." },
      { status: 500 }
    );
  }
}
