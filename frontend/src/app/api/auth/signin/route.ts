import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebaseAdmin"; // Firebase Admin instance
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Use bcrypt for password hashing

const JWT_SECRET = process.env.JWT_SECRET!;
const db = admin.firestore();

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Fetch user from Firestore
    const userRef = db.collection("users").where("email", "==", email);
    const userSnapshot = await userRef.get();

    if (userSnapshot.empty) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Get user data (Firestore returns a QuerySnapshot)
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: userData.id, email, name: userData.name },
      JWT_SECRET,
      {
        expiresIn: "60m",
      }
    );

    // Set cookie with JWT
    const response = NextResponse.json({
      message: "Signin successful",
      user: { id: userData.id, email },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
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
