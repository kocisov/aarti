import {tableize} from "inflection";
import {getCachedPool} from "./pool";

export abstract class Model {
  tableFields: Array<string> = [];

  static buildInsertQuery(table: string) {}

  async save() {
    const pool = getCachedPool();
    const table = tableize(this.constructor.name);
    const keys = [];
    const values = [];

    for (const key of Reflect.ownKeys(this)) {
      const rawValue = Reflect.get(this, key);
      const value = typeof rawValue === "string" ? `'${rawValue}'` : rawValue;
      keys.push(key);
      values.push(value);
    }

    const result = await pool.query(
      `INSERT INTO ${table}(${keys.join(", ")}) VALUES(${values.join(", ")})`
    );

    console.log("Created.", result);
  }
}
