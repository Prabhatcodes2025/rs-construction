export function supabaseServerHeaders(key: string, contentType = "application/json") {
  const headers: Record<string, string> = { apikey: key, "content-type": contentType };
  // Supabase's current sb_secret_* keys are opaque API keys, not JWTs. Sending
  // one as a bearer token makes the gateway try to parse it as a JWT.
  if (!key.startsWith("sb_secret_") && !key.startsWith("sb_publishable_")) {
    headers.Authorization = `Bearer ${key}`;
  }
  return headers;
}
