import {tableize} from "inflection";

export function createTableSchemer(fields: Array<string>) {
  return {
    id(name: string = "id") {
      fields.push(`${name} SERIAL PRIMARY KEY`);
    },
    int(name: string) {
      fields.push(`${name} INT`);
    },
    string(name: string, unique: boolean = false) {
      fields.push(`${name} VARCHAR(255) ${unique ? "UNIQUE" : ""}`);
    },
    bool(name: string) {
      fields.push(`${name} BOOLEAN`);
    },
    timestamp(name: string) {
      fields.push(`${name} TIMESTAMP DEFAULT NOW()`);
    },
    timestamptz(name: string) {
      fields.push(`${name} TIMESTAMPTZ DEFAULT NOW()`);
    },
    foreign(name: string) {
      return {
        references(column: string) {
          return {
            in(rawTable: string | {name: string}, references: string) {
              const table =
                typeof rawTable === "string"
                  ? rawTable
                  : tableize(rawTable.name);

              fields.push(
                `CONSTRAINT ${name} FOREIGN KEY(${column}) REFERENCES ${table}(${
                  references ?? column
                })`,
              );
            },
          };
        },
      };
    },
  };
}

export type FieldsBuilder = ReturnType<typeof createTableSchemer>;
