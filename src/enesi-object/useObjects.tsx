import { useQuery } from "@tanstack/react-query";
import { useObjectsWebsocket } from "~/api/useObjectsWebsocket.ts";
import { objectKeys } from "~/api/key-factory.ts";

export const useObjects = (canvasId: string) => {
  const api = useObjectsWebsocket();

  const query = useQuery({
    queryKey: objectKeys.all,
    queryFn: () => api.getAll(canvasId),
  });

  return {
    objects: query.data,
    ...query,
  };
};
