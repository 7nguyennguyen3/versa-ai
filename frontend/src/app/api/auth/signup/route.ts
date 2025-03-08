import { NextRequest, NextResponse } from "next/server";
import admin, { db } from "@/lib/firebaseAdmin"; // Firebase Admin instance
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import { UserDetail } from "@/app/_global/interface";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if the user already exists in Firestore
    const userRef = db.collection("users").where("email", "==", email);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.empty) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of hashing

    // Manually create a new user document in Firestorex
    const newUserRef = db.collection("users").doc(); // Generate a unique ID
    const userId = newUserRef.id;

    const userData: UserDetail = {
      id: userId,
      plan: "free",
      monthlyUploadUsage: 0,
      monthlyUploadLimit: 10,
      name: name || "user",
      email,
      role: "user",
    };

    await newUserRef.set({
      ...userData,
      password: hashedPassword, // Store the hashed password separately
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Generate JWT Token
    const token = jwt.sign(userData, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with JWT
    const response = NextResponse.json(
      {
        message: "Signup successful",
        user: userData,
      },
      {
        status: 201,
      }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
