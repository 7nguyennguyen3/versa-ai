import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import { db } from "@/lib/firebaseAdmin"; // Import Firestore DB

const JWT_SECRET = process.env.JWT_SECRET!; // Ensure you have this in your .env file

export async function GET(request: NextRequest) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code not found" },
      { status: 400 }
    );
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: GOOGLE_REDIRECT_URI,
          grant_type: "authorization_code",
          code,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token, id_token } = tokenResponse.data;

    // Fetch user info from Google
    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const user = userResponse.data; // { id, name, email, picture }

    // Check if user exists in Firestore
    const userRef = db.collection("users").doc(user.id);
    const doc = await userRef.get();

    if (!doc.exists) {
      // Save new user
      await userRef.set({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "user",
        plan: "free",
        monthlyUploadUsage: 0,
        monthlyUploadLimit: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // Update user data
      await userRef.update({ updatedAt: new Date() });
    }

    // Generate JWT Token
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "user",
    };

    const jwtToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set JWT in HttpOnly cookie
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set({
      name: "token",
      value: jwtToken,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Google OAuth Error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}
