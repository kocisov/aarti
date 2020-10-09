import {FieldsBuilder} from "./schema";

export interface ModelClassParam<T> {
  new (): T & {
    fields?: (t: FieldsBuilder) => void;
    constructor: {
      name: string;
    };
  };
}

export type StaticFields = "save" | "fields";
export type WithoutStaticFields<T> = Exclude<keyof T, StaticFields>;
export type SelectFields<T> = Array<WithoutStaticFields<T>> | "*";
export type WhereBuilder<T> = (
  where: (
    field: WithoutStaticFields<T>,
  ) => {
    is(value: any): void;
    isNot(value: any): void;
    isLessThan(value: number): void;
    isMoreThan(value: number): void;
  },
) => void;

export {FieldsBuilder};
