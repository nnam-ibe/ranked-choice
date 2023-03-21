export const stringifyData = <T>(data: T) => {
  return JSON.parse(JSON.stringify(data)) as T;
};
