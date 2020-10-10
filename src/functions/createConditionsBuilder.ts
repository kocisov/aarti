import {wrapString} from "./wrapString";

export function createConditionsBuilder<T>(
  conditions: Array<string>,
  field: T,
) {
  return {
    is(value: string | number) {
      conditions.push(`${field} = ${wrapString(value)}`);
    },
    isNot(value: string | number) {
      conditions.push(`${field} != ${wrapString(value)}`);
    },
    isLessThan(value: number) {
      conditions.push(`${field} < ${value}`);
    },
    isMoreThan(value: number) {
      conditions.push(`${field} > ${value}`);
    },
    isLike(value: string) {
      conditions.push(`${field} LIKE ${value}`);
    },
    isNull() {
      conditions.push(`${field} IS NULL`);
    },
    isNotNull() {
      conditions.push(`${field} IS NOT NULL`);
    },
  };
}

export type Conditions = ReturnType<typeof createConditionsBuilder>;
