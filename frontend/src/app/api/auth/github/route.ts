import { NextResponse } from "next/server";

export async function GET() {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

  const githubAuthUrl = "https://github.com/login/oauth/authorize";

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID!,
    redirect_uri: GITHUB_REDIRECT_URI!,
    scope: "user:email read:user",
  });

  return NextResponse.redirect(`${githubAuthUrl}?${params.toString()}`);
}
