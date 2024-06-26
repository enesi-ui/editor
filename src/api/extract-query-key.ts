export type Method = 'post' | 'get' | 'patch' | 'put' | 'delete';
export const extractQueryKeys = (message: {
  event: string;
  data: { [index: string]: unknown | string };
}): {
  method: Method;
  keys: string[];
} => {
  const isString = (value: unknown): value is string => typeof value === "string";
  const event = message.event.split("/");
  const idKey = event.find((key) => key.startsWith(":"))?.slice(1);
  const method = event[event.length - 1];
  const keys = event
    .slice(0, event.length - 1)
    .map((key) =>
      key === `:${idKey}` && idKey && message.data[idKey] ? message.data[idKey] : key,
    );

  return {
    method: method as Method,
    keys: keys.filter(isString)
  };
};
