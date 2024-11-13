import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../AuthComponent/AuthProvider";
import ProtectedRoute from "../AuthComponent/ProtectedRoute";
import Home from "./Home";
import Login from "./SignIn";
import AddNewMerchant from "./Addmerchant";
import AddnewProduct from "./Addproduct";
import CategoryProduct from "./CategoryProduct";
import ProductBuy from "./ProductBuy";
import UserCart from "./UserCart";
import AddUser from "./SignUp";

function Routes() {
  const { user } = useAuth();

  const routesForPublic = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/category/:id",
      element: <CategoryProduct />,
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
        {
          path: "/product/:id",
          element: <ProductBuy />,
        },
        {
          path: "/cart",
          element: <UserCart />,
        },
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <AddUser />,
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
