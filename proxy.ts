import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // /admin/login fica FORA do proxy — protegê-la causaria loop de redirect
  matcher: ["/admin", "/admin/((?!login).+)"],
};
