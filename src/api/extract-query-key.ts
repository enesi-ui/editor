export const extractQueryKeys = (message: {
  event: string;
  data: { id?: string };
}): {
  method: string;
  keys: string[];
} => {
  const event = message.event.split("/");
  const method = event[event.length - 1];
  const keys = event
    .slice(0, event.length - 1)
    .map((key) => (key === ":id" && message.data.id ? message.data.id : key));

  return {
    method,
    keys,
  };
};
