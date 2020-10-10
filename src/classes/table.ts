import {tableize} from "inflection";
import {Database} from "./database";
import {ModelClassParam} from "../interfaces";
import {createTableSchemaBuilder} from "../functions/createTableSchemaBuilder";
import {Model} from "./model";

export abstract class Table {
  private static template(name: string, fields: string) {
    return `CREATE TABLE IF NOT EXISTS ${name}(\n${fields}\n);`;
  }

  private static addTab(value: string) {
    return `  ${value}`;
  }

  static async drop<T extends Model>(model: string | ModelClassParam<T>) {
    const table = typeof model === "string" ? model : tableize(model.name);

    return await Database.pool.query(`DROP TABLE IF EXISTS ${table}`);
  }

  static async create<T extends Model>(
    Model: ModelClassParam<T>,
    queryOnly: boolean = false,
  ) {
    const fields: Array<string> = [];
    const associations: Array<string> = [];

    const model = new Model();

    if (!model.fields) {
      throw new Error(`Fields must be specified! [${model.constructor.name}]`);
    }

    model.fields(createTableSchemaBuilder(fields, associations));
    fields.push(...associations);

    const table = tableize(model.constructor.name);
    const normalizedFields = fields.map(Table.addTab).join(",\n");
    const query = Table.template(table, normalizedFields);

    if (queryOnly) {
      return query;
    }

    return await Database.pool.query(query);
  }
}
