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
export type Omittable = StaticModelFields;
export type WithoutStaticFields<T> = Exclude<keyof T, StaticModelFields>;
export type SelectFieldsArray<T> = Array<WithoutStaticFields<T>>;
export type SelectFields<T> = SelectFieldsArray<T> | "*";

export type WhereBuilder<T> = (
  where: (field: WithoutStaticFields<T>) => Conditions,
) => void;

export type ObjectFrom<T> = {
  [key in keyof T]?: T[key];
};

export type ModelFieldsInObject<T> = ObjectFrom<Omit<T, Omittable>>;

export type ObjectType<T> = {new (): T} | Function;

export {FieldsBuilder};
