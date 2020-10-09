import {Pool, PoolConfig} from "pg";

const cache = new Map<"pool", Pool>();

function getPool() {
  const pool = cache.get("pool");
  if (!pool) {
    throw new Error("Database Pool is not available!");
  }
  return pool;
}

export class Database {
  constructor(config: PoolConfig) {
    const pool = new Pool(config);
    cache.set("pool", pool);

    pool
      .on("connect", () => {
        console.log("Database connected.");
      })
      .on("error", (error) => {
        console.error("Unexpected error on Database Pool", error);
        process.exit(-1);
      })
      .on("remove", () => {
        console.log("Database Pool was removed.");
      });
  }

  static get pool() {
    return getPool();
  }

  static async query(query: string | Array<string>) {
    // For checkout usage
    // const client = await Database.pool.connect();
    // const result = await client.query(query);
    // await client.release();
    // return result;

    if (Array.isArray(query)) {
      query = query.join(" ");
    }

    const {rowCount, rows} = await Database.pool.query(query);

    return {
      length: rowCount,
      data: rows,
    };
  }

  static async end() {
    await this.pool.end();
  }
}
