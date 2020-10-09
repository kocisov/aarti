export function createConditionsBuilder(conditions: Array<string>, field: any) {
  return {
    is(value: string | number) {
      if (typeof value === "string") {
        value = `'${value}'`;
      }
      conditions.push(`${field} = ${value}`);
    },
    isNot(value: string | number) {
      if (typeof value === "string") {
        value = `'${value}'`;
      }
      conditions.push(`${field} != ${value}`);
    },
    isLessThan(value: number) {
      conditions.push(`${field} < ${value}`);
    },
    isMoreThan(value: number) {
      conditions.push(`${field} > ${value}`);
    },
  };
}
