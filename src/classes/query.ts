import {WithoutStaticFields} from "../interfaces";

export class Query {
  static insert(table: string, keys: string, values: string) {
    return `INSERT INTO ${table}(${keys}) VALUES(${values})`;
  }

  static fields(fields: any) {
    return Array.isArray(fields) ? fields.join(", ") : fields;
  }

  static where(conditions: Array<string>) {
    if (conditions.length === 0) {
      return "";
    }
    return `WHERE ${conditions.join(" AND ")}`;
  }

  static limit(count?: number) {
    return count ? `LIMIT ${count}` : "";
  }

  static orderBy<T>(table: string, field?: WithoutStaticFields<T>) {
    return `ORDER BY ${table}.${field ?? "id"}`;
  }
}
