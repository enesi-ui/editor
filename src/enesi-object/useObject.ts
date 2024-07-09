import { useQuery } from "@tanstack/react-query";
import { objectKeys } from "~/api/key-factory.ts";
import { useObjectsWebsocket } from "~/api/useObjectsWebsocket.ts";

export const useObject = (id?: string) => {
  const api = useObjectsWebsocket();

  const query = useQuery({
    queryKey: id ? objectKeys.detail(id) : [] ,
    queryFn: () => (id ? api.get(id) : null),
    enabled: !!id,
  });

  return {
    ...query,
    object: query.data,
  };
};
