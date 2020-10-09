import {FieldsBuilder} from "./functions/createTableSchemaBuilder";
import {Conditions} from "./functions/createConditionsBuilder";

export interface ModelClassParam<T> {
  new (): T & {
    fields: (t: FieldsBuilder, associations?: Array<string>) => void;
    constructor: {
      name: string;
    };
  };
}

export type StaticModelFields = "save" | "fields";

export type WithoutStaticFields<T> = Exclude<keyof T, StaticModelFields>;

export type SelectFields<T> = Array<WithoutStaticFields<T>> | "*";

export type WhereBuilder<T> = (
  where: (field: WithoutStaticFields<T>) => Conditions,
) => void;

export {FieldsBuilder};
