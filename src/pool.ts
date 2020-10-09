import {Pool, PoolConfig} from "pg";

const cache = new Map<"pool", Pool>();

export async function createPool(config: PoolConfig) {
  const pool = new Pool(config);
  await pool.connect();
  cache.set("pool", pool);
  return pool;
}

export function getCachedPool() {
  const pool = cache.get("pool");
  if (!pool) {
    throw new Error("Database Pool is not available!");
  }
  return pool;
}
