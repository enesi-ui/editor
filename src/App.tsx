import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

function App() {
  return (
    <div className="bg-base-100">
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
    </div>
  );
}

export default App;
