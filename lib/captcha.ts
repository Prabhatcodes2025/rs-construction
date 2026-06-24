import crypto from "crypto";

const CAPTCHA_TTL_MS = 10 * 60 * 1000;
const fallbackSecret = "rs-construction-captcha-fallback-secret";

type TextCaptchaPayload = {
  answer: number;
  nonce: string;
  ts: number;
};

function secret() {
  return process.env.ADMIN_SESSION_SECRET || fallbackSecret;
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function captchaProvider() {
  return (process.env.CAPTCHA_PROVIDER?.trim() || "google").toLowerCase();
}

export function captchaFallbackEnabled() {
  return process.env.ENABLE_CAPTCHA_FALLBACK === "true";
}

export function createTextCaptchaChallenge() {
  const left = crypto.randomInt(2, 10);
  const right = crypto.randomInt(2, 10);
  const payload: TextCaptchaPayload = { answer: left + right, nonce: crypto.randomUUID(), ts: Date.now() };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return { question: `What is ${left} + ${right}?`, token: `${encoded}.${sign(encoded)}` };
}

export function verifyTextCaptcha(token?: string, answer?: unknown) {
  const value = Number(String(answer ?? "").trim());
  if (!token || !Number.isFinite(value)) return { success: false, error: "Please answer the security question correctly." };
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return { success: false, error: "Please answer the security question correctly." };
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(sign(encoded)))) {
      return { success: false, error: "Please answer the security question correctly." };
    }
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as TextCaptchaPayload;
    if (!payload.ts || Date.now() - payload.ts > CAPTCHA_TTL_MS || payload.answer !== value) {
      return { success: false, error: "Please answer the security question correctly." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Please answer the security question correctly." };
  }
}
