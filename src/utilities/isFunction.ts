type FunctionOrClass = any;

export function isFunction(funcOrClass: FunctionOrClass) {
  const propertyNames = Object.getOwnPropertyNames(funcOrClass);
  return (
    !propertyNames.includes("prototype") || propertyNames.includes("arguments")
  );
}
