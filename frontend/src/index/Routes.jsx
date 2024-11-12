import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../AuthComponent/AuthProvider";
import ProtectedRoute from "../AuthComponent/ProtectedRoute";
import Home from "./Home";

function Routes() {
  const { token } = useAuth();

  const routesForPublic = [
    {
      path: "/",
      element: <Home />,
    },
  ];

  const routesForAuthenticatedOnly = [];

  const routesForNotAuthenticatedOnly = [];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
}

export default Routes;
