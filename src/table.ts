import {tableize} from "inflection";
import {ModelClassParam} from "./interfaces";
import {getCachedPool} from "./pool";
import {createTableSchemer} from "./schema";

export abstract class Table {
  private static template(name: string, fields: string) {
    return `CREATE TABLE IF NOT EXISTS "${name}"(\n${fields}\n);`;
  }

  private static addTab(value: string) {
    return `  ${value}`;
  }

  static async drop(table: string) {
    const pool = getCachedPool();
    return await pool.query(`DROP TABLE [IF EXISTS] ${table}`);
  }

  static async create<T>(
    Model: ModelClassParam<T>,
    queryOnly: boolean = false
  ) {
    const fields: Array<string> = [];
    const pool = getCachedPool();

    const model = new Model();

    if (!model.fields) {
      throw new Error(`Fields must be specified! [${model.constructor.name}]`);
    }

    model.fields(createTableSchemer(fields));

    const table = tableize(model.constructor.name);
    const normalizedFields = fields.map(Table.addTab).join(",\n");
    const query = Table.template(table, normalizedFields);

    if (queryOnly) {
      return query;
    }

    return await pool.query(query);
  }
}
