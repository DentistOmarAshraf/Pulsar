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
import ScrollToTop from "../component/ScrollToTop";

function Routes() {
  const { user } = useAuth();

  const routesForPublic = [
    {
      path: "/",
      element: (
        <>
          <ScrollToTop />
          <Home />
        </>
      ),
    },
    {
      path: "/category/:id",
      element: (
        <>
          <ScrollToTop />
          <CategoryProduct />
        </>
      ),
    },
  ];

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/addmerchant",
          element: (
            <>
              <ScrollToTop />
              <AddNewMerchant />
            </>
          ),
        },
        {
          path: "/addproduct",
          element: (
            <>
              <ScrollToTop />
              <AddnewProduct />
            </>
          ),
        },
        {
          path: "/product/:id",
          element: (
            <>
              <ScrollToTop />
              <ProductBuy />
            </>
          ),
        },
        {
          path: "/cart",
          element: (
            <>
              <ScrollToTop />
              <UserCart />
            </>
          ),
        },
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: (
        <>
          <ScrollToTop />
          <Login />
        </>
      ),
    },
    {
      path: "/signup",
      element: (
        <>
          <ScrollToTop />
          <AddUser />
        </>
      ),
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
