import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "session";

function getSecretKey() {
  const s = process.env.JWT_SECRET;
  if (!s) {
    throw new Error("Defina JWT_SECRET no ambiente.");
  }
  return new TextEncoder().encode(s);
}

/** Sessão persistente até o usuário sair (cookie + JWT alinhados em ~10 anos). */
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 365 * 10;

export async function signSessionToken(userId: string): Promise<string> {
  const exp = new Date(Date.now() + SESSION_MAX_AGE_SEC * 1000);
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, getSecretKey());
  const sub = payload.sub;
  if (!sub || typeof sub !== "string") {
    throw new Error("Token inválido");
  }
  return sub;
}

export async function getSessionUserId(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export function sessionCookieMaxAgeSec() {
  return SESSION_MAX_AGE_SEC;
}
