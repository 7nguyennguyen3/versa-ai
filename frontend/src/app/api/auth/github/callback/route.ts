import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import { db } from "@/lib/firebaseAdmin"; // Import Firestore DB

const JWT_SECRET = process.env.JWT_SECRET!; // Ensure you have this in your .env file

export async function GET(request: NextRequest) {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
  const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

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
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: GITHUB_REDIRECT_URI,
        },
        headers: { Accept: "application/json" },
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      throw new Error("Failed to retrieve access token");
    }

    // Fetch user info from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userResponse.data; // { id, name, email, avatar_url, etc. }

    // Fetch user emails (GitHub requires a separate request for email)
    const emailResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const primaryEmail = emailResponse.data.find(
      (email: any) => email.primary
    )?.email;

    // Check if user exists in Firestore
    const userRef = db.collection("users").doc(user.id.toString());
    const doc = await userRef.get();

    if (!doc.exists) {
      // Save new user
      await userRef.set({
        id: user.id,
        name: user.name || user.login, // Fallback to GitHub username if name is not provided
        email: primaryEmail,
        avatar: user.avatar_url,
        role: "user",
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
      name: user.name || user.login,
      email: primaryEmail,
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
    console.error("GitHub OAuth Error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate with GitHub" },
      { status: 500 }
    );
  }
}
