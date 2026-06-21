import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";

export default auth((req) => {
  if (req.nextUrl.pathname === "/api/auth/callback/credentials") {
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown";

    if (!checkRateLimit(`login:${ip}`, 5, 60 * 1000)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em 1 minuto." },
        { status: 429 }
      );
    }
  }
});

export const config = {
  matcher: [
    "/admin",
    "/admin/((?!login).+)",
    "/api/auth/callback/credentials",
  ],
};
