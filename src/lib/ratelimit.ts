import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "~/env";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});


// Global per-IP throttle for general API traffic
export const rlGlobal = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "10 s"), // 50 req / 10s per key
  analytics: true,
  prefix: "rl_global",
});

// Uploads (burstier but bounded)
export const rlUpload = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 m"),
  analytics: true,
  prefix: "rl_upload",
});

// Small util to extract IP
export function getClientIP(req: Request | { headers: Headers; ip?: string }) {
  // NextRequest has .ip; also honor proxy headers

  const direct = "ip" in req ? (req as { ip?: string }).ip : undefined;
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = req.headers.get("x-real-ip")?.trim();
  return direct ?? fwd ?? real ?? "unknown";
}