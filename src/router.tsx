import { createBrowserRouter } from "react-router-dom";
import { Root } from "./root/root.tsx";
import { EditorRoot } from "~/editor/EditorRoot.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
  },
  {
    path: "editor",
    Component: EditorRoot,
  },
]);
