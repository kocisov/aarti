import {Model} from "./model";
import {ObjectFrom, SelectFields, WithoutStaticFields} from "../interfaces";
import {wrapString} from "../functions/wrapString";

export class Query {
  static insert(table: string, keys: string, values: string) {
    return `INSERT INTO ${table}(${keys}) VALUES(${values})`;
  }

  static fields<T extends Model>(fields?: SelectFields<T>) {
    if (!fields || fields.length === 0) {
      return "*";
    }
    if (Array.isArray(fields)) {
      return fields.join(", ");
    }
    throw new Error("Fields should be Array/Spread or Nothing.");
  }

  static from(table: string) {
    return `FROM ${table}`;
  }

  static mapObjectValues<T>(objectValues: ObjectFrom<T>) {
    return Object.keys(objectValues).map(
      (key) => `${key} = ${wrapString((objectValues as any)[key])}`,
    );
  }

  static where<T extends Model>(conditionsOrId: ObjectFrom<T> | number) {
    if (typeof conditionsOrId === "number") {
      return `WHERE id = ${conditionsOrId}`;
    }
    return `WHERE ${Query.mapObjectValues(conditionsOrId).join(" AND ")}`;
  }

  static limit(count?: number) {
    return count ? `LIMIT ${count}` : "";
  }

  static orderBy<T>(table: string, field?: WithoutStaticFields<T>) {
    return `ORDER BY ${table}.${field ?? "id"}`;
  }
}
