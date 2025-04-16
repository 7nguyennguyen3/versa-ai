import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const DEBUG = false;

export async function middleware(req: NextRequest) {
  if (DEBUG) {
    return NextResponse.json(
      { message: "Middleware is working" },
      { status: 200 }
    );
  }

  const token = req.cookies.get("token")?.value;
  const protectedRoutes = [
    "/dashboard",
    "/chat",
    "/pdf-chat",
    "/upload-pdf",
    "/settings",
  ];
  const requestedPath = req.nextUrl.pathname;

  // Exclude the demo endpoint from authentication
  if (requestedPath === "/api/chat/demo") {
    return NextResponse.next(); // Allow unauthenticated access to the demo endpoint
  }

  if (protectedRoutes.some((route) => requestedPath.startsWith(route))) {
    if (!token || token.trim() === "") {
      return NextResponse.redirect(new URL("unauthorized", req.url)); // Redirect to login page
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next(); // Allow access
    } catch (error) {
      return NextResponse.redirect(new URL("unauthorized", req.url)); // Redirect if token is invalid
    }
  }

  // Protect other API routes (e.g., /api/chat)
  if (requestedPath.startsWith("/api/chat")) {
    if (!token || token.trim() === "") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next(); // Allow API access
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// Apply middleware to both API and page routes
export const config = {
  matcher: [
    "/api/chat/:path*",
    "/api/pdf/:path*",
    "/dashboard",
    "/chat",
    "/pdf-chat",
    "/upload-pdf",
    "/settings",
  ],
};
