import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "session";

function secretKey() {
  const s = process.env.JWT_SECRET;
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function middleware(request: NextRequest) {
  const key = secretKey();
  const token = request.cookies.get(COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const verify = async () => {
    if (!key || !token) return false;
    try {
      await jwtVerify(token, key);
      return true;
    } catch {
      return false;
    }
  };

  const protectedApp =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/extratos") ||
    pathname.startsWith("/relatorios");

  if (protectedApp) {
    if (!(await verify())) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/register") {
    if (await verify()) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/extratos",
    "/extratos/:path*",
    "/relatorios",
    "/relatorios/:path*",
    "/login",
    "/register",
  ],
};
