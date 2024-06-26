import { useQuery } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";
import { shapeKeys } from "~/api/key-factory.ts";

export const useShape = (id?: string) => {
  const api = useShapesWebSocket();

  const query = useQuery({
    queryKey: id ? shapeKeys.detail(id) : [] ,
    queryFn: () => (id ? api.get(id) : null),
    enabled: !!id,
  });

  return {
    ...query,
    shape: query.data,
  };
};
