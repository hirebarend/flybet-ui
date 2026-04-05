import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Simple deterministic hash (djb2) from a string → unsigned 32-bit integer.
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Seeded pseudo-random number generator (mulberry32).
 * Returns a function that produces deterministic floats in [0, 1).
 */
function seededRandom(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates deterministic base pool stats for a flight.
 * - Staker count: 5–15
 * - Per-staker amount: 50–100
 * The result is always the same for a given flightId.
 */
export function getBasePool(flightId: string): {
  basePool: number;
  baseStakers: number;
} {
  const rng = seededRandom(hashString(flightId));
  const baseStakers = 5 + Math.floor(rng() * 11); // 5..15
  const basePool = baseStakers * 50;
  return { basePool, baseStakers };
}
