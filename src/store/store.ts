import { createRef, MutableRefObject } from "react";

type Operation<StoreType> = (store: StoreType) => StoreType;
type InitFunction<StoreType> = (
  set: (operation: Operation<StoreType>) => void,
  get: () => StoreType,
) => StoreType;

const createStore = <StoreType>(init: InitFunction<StoreType>) => {
  const store: MutableRefObject<StoreType | null> = createRef<StoreType>();

  const set = (operation: Operation<StoreType>) => {
    store.current = operation(store.current as StoreType);
    return store;
  };

  store.current = init(set, () => store.current as StoreType);

  return () => {
    return store as MutableRefObject<StoreType>;
  };
};

export { createStore };
