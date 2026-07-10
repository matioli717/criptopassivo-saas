import { NextRequest, NextResponse } from "next/server";
import { ALL_COINGECKO_IDS } from "@/lib/assets";
import { redis } from "@/lib/redis";
import { checkRateLimit } from "@/lib/ratelimit";

const CACHE_KEY = 'coingecko:prices';
const CACHE_TTL_SECONDS = 20;

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const { success } = await checkRateLimit(`prices:${ip}`);
  
  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const cached = await redis.get<string>(CACHE_KEY);
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  try {
    const ids = ALL_COINGECKO_IDS.join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`CoinGecko respondeu ${res.status}`);
    }

    const data = await res.json();
    await redis.setex(CACHE_KEY, CACHE_TTL_SECONDS, JSON.stringify(data));
    return NextResponse.json(data);
  } catch (err) {
    const stale = await redis.get<string>(CACHE_KEY);
    if (stale) return NextResponse.json(JSON.parse(stale));
    return NextResponse.json({ error: 'Não foi possível buscar preços agora.' }, { status: 502 });
  }
}