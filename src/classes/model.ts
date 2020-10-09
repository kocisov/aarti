import {tableize} from "inflection";
import {Database} from "./database";
import {Query} from "./query";
import {
  ModelFieldsInObject,
  SelectFields,
  WithoutStaticFields,
} from "../interfaces";
import {wrapString} from "../functions/wrapString";

export abstract class Model {
  static find<T>(limit?: number) {
    const table = tableize(this.name);
    const conditions: Array<string> = [];

    return {
      where(fields: ModelFieldsInObject<T>) {
        Object.keys(fields).forEach((key) => {
          // @ts-ignore
          conditions.push(`${key} = ${fields[key]}`);
        });

        return {
          async execute() {
            return await Database.query([
              `SELECT * FROM ${table}`,
              Query.where(conditions),
              Query.limit(limit),
            ]);
          },
          async update(fields: ModelFieldsInObject<T>) {
            const keys = Object.keys(fields);

            return await Database.query([
              `UPDATE ${table} SET`,
              keys
                // @ts-ignore
                .map((key) => `${key} = ${wrapString(fields[key])}`)
                .join(", "),
              Query.where(conditions),
            ]);
          },
        };
      },
      async fields(rawFields: SelectFields<T>) {
        const fields = Query.fields(rawFields);

        return await Database.query([
          `SELECT ${fields} FROM ${table}`,
          Query.where(conditions),
          Query.limit(limit),
        ]);
      },
    };
  }

  static async all<T>(rawFields: SelectFields<T>) {
    const table = tableize(this.name);
    const fields = Query.fields(rawFields);

    return await Database.query(`SELECT ${fields} FROM ${table}`);
  }

  static async first<T>(
    count: number,
    rawFields: SelectFields<T>,
    orderBy?: WithoutStaticFields<T>,
  ) {
    const table = tableize(this.name);
    const fields = Query.fields(rawFields);

    return await Database.query([
      `SELECT ${fields} FROM ${table}`,
      Query.orderBy<T>(table, orderBy),
      `ASC`,
      Query.limit(count),
    ]);
  }

  static async last<T>(
    count: number,
    rawFields: SelectFields<T>,
    orderBy?: WithoutStaticFields<T>,
  ) {
    const table = tableize(this.name);
    const fields = Query.fields(rawFields);

    return await Database.query([
      `SELECT ${fields} FROM ${table}`,
      Query.orderBy<T>(table, orderBy),
      `DESC`,
      Query.limit(count),
    ]);
  }

  static async updateAll<T>(fields: ModelFieldsInObject<T>) {
    const table = tableize(this.name);
    const keys = Object.keys(fields);

    return await Database.query([
      `UPDATE ${table} SET`,
      // @ts-ignore
      keys.map((key) => `${key} = ${wrapString(fields[key])}`).join(", "),
    ]);
  }

  async save() {
    const table = tableize(this.constructor.name);
    const keys = [];
    const values = [];

    for (const key of Object.keys(this)) {
      const rawValue = Reflect.get(this, key);
      const value = typeof rawValue === "string" ? `'${rawValue}'` : rawValue;
      keys.push(key);
      values.push(value);
    }

    try {
      return await Database.query(
        Query.insert(table, keys.join(", "), values.join(", ")),
      );
    } catch (error) {
      console.error(error.message);
    }
  }
}
