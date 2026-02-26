import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/chat", "/chat"];
const publicRoutes = ["/signup", "/signin", "/"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some((route) => path === route);

  try {
    const sessionResponse = await fetch(
      `${process.env.BACKEND_URL}/api/auth/validate-user`,
      {
        method: "GET",
        credentials: "same-origin",
        headers: {
          cookie: req.headers.get("cookie") ?? "",
        },
      },
    );
    const session = await sessionResponse.json();

    const response = NextResponse.next();
    if (session.accessToken) {
      response.cookies.set("accessToken", session.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    }

    if (isProtectedRoute && session.error === "unauthenticated") {
      return NextResponse.redirect(new URL("/signin", req.nextUrl));
    }

    const user = session.user;
    if (isPublicRoute && user.id && !req.nextUrl.pathname.startsWith("/chat")) {
      return NextResponse.redirect(new URL("/chat", req.nextUrl));
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.next();
  }
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    "/chat/:path*",
    "/signup",
    "/signin",
    "/",
    // Exclude API routes, static files, image optimizations, and .png files
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
