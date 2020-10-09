import {tableize} from "inflection";

export function createTableSchemaBuilder(
  fields: Array<string>,
  associations: Array<string>,
) {
  return {
    id(name: string = "id") {
      fields.push(`${name} SERIAL PRIMARY KEY`);
    },
    int(name: string, notNull = true) {
      fields.push(`${name} INT${notNull ? " NOT NULL" : ""}`);
    },
    string(name: string, notNull = true, unique: boolean = false) {
      fields.push(
        `${name} VARCHAR(255)${notNull ? " NOT NULL" : ""}${
          unique ? " UNIQUE" : ""
        }`,
      );
    },
    bool(name: string, defaultValue = false) {
      fields.push(`${name} BOOLEAN DEFAULT ${defaultValue}`);
    },
    timestamp(name: string) {
      fields.push(`${name} TIMESTAMP NOT NULL DEFAULT NOW()`);
    },
    timestamptz(name: string) {
      fields.push(`${name} TIMESTAMPTZ NOT NULL DEFAULT NOW()`);
    },
    json(name: string) {
      fields.push(`${name} JSON NOT NULL`);
    },
    foreign(name: string) {
      return {
        references(column: string) {
          return {
            in(rawTable: string | {name: string}, references?: string) {
              const table =
                typeof rawTable === "string"
                  ? rawTable
                  : tableize(rawTable.name);

              fields.push(`${column} INT`);
              associations.push(
                `CONSTRAINT ${name} FOREIGN KEY(${column}) REFERENCES ${table}(${
                  references ?? column ?? "id"
                }) ON DELETE RESTRICT ON UPDATE CASCADE`,
              );
            },
          };
        },
      };
    },
  };
}

export type FieldsBuilder = ReturnType<typeof createTableSchemaBuilder>;
