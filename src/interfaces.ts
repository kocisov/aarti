import {FieldsObject} from "./schema";

export interface ModelClassParam<T> {
  new (): T & {
    fields?: (t: FieldsObject) => void;
    constructor: {
      name: string;
    };
  };
}

export {FieldsObject};
