import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "rs_admin_session";
// Temporary recovery fallback. Replace these with Vercel environment variables before handover.
export const temporaryAdmin = { username: "admin", password: "admin123" };
const temporarySessionSecret = "rs-construction-temporary-recovery-session-secret";
const secret = () => process.env.ADMIN_SESSION_SECRET || temporarySessionSecret;

export function adminCredentials() {
  return {
    username: process.env.ADMIN_EMAIL || temporaryAdmin.username,
    password: process.env.ADMIN_PASSWORD || temporaryAdmin.password,
    temporary: !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET,
  };
}

export function recaptchaEnabled() {
  return process.env.ENABLE_RECAPTCHA === "true";
}

export function createSession(email: string) {
  const expires = Date.now() + 8 * 60 * 60 * 1000;
  const payload = `${email}|${expires}`;
  const signature = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}
export function verifySession(token?: string) {
  if (!token || !secret()) return false;
  try {
    const [email, expiry, signature] = Buffer.from(token, "base64url").toString().split("|");
    if (!email || Number(expiry) < Date.now()) return false;
    const expected = crypto.createHmac("sha256", secret()).update(`${email}|${expiry}`).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch { return false; }
}
export async function isAdmin() { return verifySession((await cookies()).get(COOKIE)?.value); }
export const sessionCookie = COOKIE;

export async function verifyRecaptcha(token?: string) {
  if (!recaptchaEnabled()) return true;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    if (process.env.NODE_ENV !== "production" || process.env.ALLOW_DEV_CAPTCHA === "true") return token === "dev-verified";
    return token === "recaptcha-not-configured";
  }
  if (!token) return false;
  const body = new URLSearchParams({ secret: secretKey, response: token });
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", { method: "POST", body, cache: "no-store" });
  if (!response.ok) return false;
  const result = await response.json() as { success?: boolean };
  return Boolean(result.success);
}
