import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../AuthComponent/AuthProvider";
import ProtectedRoute from "../AuthComponent/ProtectedRoute";
import Home from "./Home";
import Login from "./SignIn";

function Routes() {
  const { user } = useAuth();

  const routesForPublic = [
    {
      path: "/",
      element: <Home />,
    },
  ];

  const routesForAuthenticatedOnly = [];

  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <Login />,
    },
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!user.token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
}

export default Routes;
