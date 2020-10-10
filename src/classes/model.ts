import {tableize} from "inflection";
import {Database} from "../classes/database";
import {Query} from "../classes/query";
import {wrapString} from "../functions/wrapString";
import {isObjectEmpty} from "../functions/isObjectEmpty";
import {
  ModelFieldsInObject,
  ObjectFrom,
  ObjectType,
  SelectFieldsArray,
  WithoutStaticFields,
} from "../interfaces";

export abstract class Model {
  static find<T extends Model>(
    this: ObjectType<T>,
    whereFieldsOrId: ObjectFrom<T> | number | null | undefined,
    ...selectFields: SelectFieldsArray<T>
  ) {
    if (
      whereFieldsOrId &&
      typeof whereFieldsOrId !== "number" &&
      isObjectEmpty(whereFieldsOrId)
    ) {
      throw new Error("Conditions/id missing in find(...)!");
    }

    const table = tableize(this.name);

    return Database.query([
      `SELECT`,
      Query.fields(selectFields),
      Query.from(table),
      whereFieldsOrId ? Query.where<T>(whereFieldsOrId) : "",
    ]);
  }

  static async first<T extends Model>(
    this: ObjectType<T>,
    limit: number = 1,
    orderBy: WithoutStaticFields<T>,
    ...fields: SelectFieldsArray<T>
  ) {
    const table = tableize(this.name);
    return await Database.query([
      `SELECT`,
      Query.fields(fields),
      Query.from(table),
      Query.orderBy(table, orderBy),
      `ASC`,
      Query.limit(limit),
    ]);
  }

  static async last<T extends Model>(
    this: ObjectType<T>,
    limit: number = 1,
    orderBy: WithoutStaticFields<T>,
    ...fields: SelectFieldsArray<T>
  ) {
    const table = tableize(this.name);
    return await Database.query([
      `SELECT`,
      Query.fields(fields),
      Query.from(table),
      Query.orderBy(table, orderBy),
      `DESC`,
      Query.limit(limit),
    ]);
  }

  static async updateAll<T extends Model>(
    this: ObjectType<T>,
    fields: ModelFieldsInObject<T>,
  ) {
    const table = tableize(this.name);

    return await Database.query([
      `UPDATE ${table} SET`,
      Query.mapObjectValues(fields).join(", "),
    ]);
  }

  static where<T extends Model>(
    this: ObjectType<T>,
    where: ModelFieldsInObject<T>,
    limit?: number,
  ) {
    const table = tableize(this.name);

    return {
      async update(fields: ModelFieldsInObject<T>) {
        return await Database.query([
          `UPDATE ${table} SET`,
          Query.mapObjectValues(fields).join(", "),
          Query.where(where),
          Query.limit(limit),
        ]);
      },
    };
  }

  async save() {
    const table = tableize(this.constructor.name);
    const keys = [];
    const values = [];

    for (const key of Object.keys(this)) {
      const rawValue = Reflect.get(this, key);
      const value = wrapString(rawValue);
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
