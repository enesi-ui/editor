import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useObjectsWebsocket } from "~/api/useObjectsWebsocket.ts";
import { getCacheKey } from "~/enesi-object/objectType.ts";
import { EnesiObject } from "~/enesi-object/EnesiObject.ts";

export const useObjectUpdate = () => {
  const queryClient = useQueryClient();
  const api = useObjectsWebsocket();

  const mutationZIndex = useMutation({
    mutationFn: api.patchZIndex,
    onSettled: async (data) => {
      if (!data) return;
      const { id: objectId } = data;
      const key = getCacheKey(data);
      queryClient.setQueryData(key.detail, data);
      queryClient.setQueryData(key.all, (objects: EnesiObject[]) =>
        objects.map((object) => (object.id === objectId ? data : object)),
      );
    },
  });

  const mutation = useMutation({
    mutationFn: api.patch,
    onSettled: async (data) => {
      if (!data) return;
      const { id: objectId } = data;
      const key = getCacheKey(data);
      queryClient.setQueryData(key.detail, data);
      queryClient.setQueryData(key.all, (objects: EnesiObject[]) =>
        objects.map((object) => (object.id === objectId ? data : object)),
      );
    },
  });


  return {
    isPending: mutationZIndex.isPending,
    updateZIndex: mutationZIndex.mutate,
    update: mutation.mutate,
    variables: mutationZIndex.variables,
  };
};
