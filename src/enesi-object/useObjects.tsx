import { useQuery } from "@tanstack/react-query";
import { useObjectsWebsocket } from "~/api/useObjectsWebsocket.ts";
import { objectKeys } from "~/api/key-factory.ts";

export const useObjects = () => {
  const api = useObjectsWebsocket();

  const query = useQuery({
    queryKey: objectKeys.all,
    queryFn: api.getAll,
  });

  return {
    objects: query.data,
    ...query,
  };
};
