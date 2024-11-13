import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../AuthComponent/AuthProvider";
import ProtectedRoute from "../AuthComponent/ProtectedRoute";
import Home from "./Home";
import Login from "./SignIn";
import AddNewMerchant from "./Addmerchant";
import AddnewProduct from "./Addproduct";

function Routes() {
  const { user } = useAuth();

  const routesForPublic = [
    {
      path: "/",
      element: <Home />,
    },
  ];

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/addmerchant",
          element: <AddNewMerchant />,
        },
        {
          path: "/addproduct",
          element: <AddnewProduct />,
        },
      ],
    },
  ];

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
