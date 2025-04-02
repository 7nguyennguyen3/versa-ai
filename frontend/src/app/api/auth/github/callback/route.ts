import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import { db } from "@/lib/firebaseAdmin";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
  const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    console.error("Error: No authorization code found");
    return NextResponse.json(
      { error: "Authorization code not found" },
      { status: 400 }
    );
  }

  try {
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

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userResponse.data;

    const emailResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const primaryEmail = emailResponse.data.find(
      (email: any) => email.primary
    )?.email;

    const userId = user.id.toString();
    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();

    const userData = {
      id: user.id,
      name: user.name || user.login,
      email: primaryEmail,
      avatar: user.avatar_url,
      role: "user",
      plan: "free",
      monthlyUploadUsage: 0,
      monthlyUploadLimit: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!doc.exists) {
      await userRef.set(userData);
    } else {
      await userRef.update({ updatedAt: new Date() });
    }

    const tokenPayload = {
      id: user.id,
      name: user.name || user.login,
      email: primaryEmail,
      role: "user",
    };

    const jwtToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set({
      name: "token",
      value: jwtToken,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("GitHub OAuth Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to authenticate with GitHub" },
      { status: 500 }
    );
  }
}
