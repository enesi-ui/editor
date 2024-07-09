import { createBrowserRouter } from "react-router-dom";
import { Root } from "./root/root.tsx";
import { EditorRoot } from "~/editor/EditorRoot.tsx";
import { Start } from "~/canvas/Start.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
  },
  {
    path: "start",
    Component: Start,
  },
  {
    path: "editor",
    Component: EditorRoot,
    children: [
      {
        path: ":id",
        Component: EditorRoot,
      }
    ]
  },
]);
