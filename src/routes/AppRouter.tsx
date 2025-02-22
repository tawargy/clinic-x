import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainRoutes from "./MainRoutes";

const router = createBrowserRouter([MainRoutes], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_startTransition: true,
    v7_partialHydration: true,
    v7_normalizeFormMethod: true,
    v7_skipActionErrorRevalidation: true,
  },
});

function AppRouter() {
  return <RouterProvider router={router} />;
}
export default AppRouter;
