import type { NextConfig } from "next";

const supabaseHostname = (() => {
  try { return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null; }
  catch { return null; }
})();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(supabaseHostname ? [{ protocol: "https" as const, hostname: supabaseHostname }] : []),
    ],
  },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
