import checkJwtMidWare from "../controller/utils.js";
import UserController from "../controller/UsersController.js";
import MerchantController from "../controller/MerchantController.js";
import CategoriesController from "../controller/CategoriesController.js";
import ProductController from "../controller/ProductController.js";
import CartController from "../controller/CartController.js";
import OrderController from "../controller/OrderController.js";
import PhotoController from "../controller/PhotoController.js";
import upload from "../controller/photostorage.js";

const appView = (app) => {
  app.post("/signup", UserController.postUser);
  app.post("/signin", UserController.checkUser);
  app.get("/user/me", checkJwtMidWare, UserController.getUser);

  app.post("/user/merchant", checkJwtMidWare, MerchantController.postMerchant);
  app.get("/user/merchant", checkJwtMidWare, MerchantController.getMerchants);
  app.get(
    "/user/merchant/:id",
    checkJwtMidWare,
    MerchantController.getOneMerchant
  );
  app.get(
    "/user/merchant/:id/categories",
    checkJwtMidWare,
    CategoriesController.getMerchantCategories
  );
  app.put(
    "/user/merchant/:id",
    checkJwtMidWare,
    MerchantController.updateMerchant
  );
  app.delete(
    "/user/merchant/:id",
    checkJwtMidWare,
    MerchantController.deleteMerchant
  );

  app.get("/categories", CategoriesController.getAllCategories);
  app.get(
    "/categories/:id/products",
    CategoriesController.getProductsInCategory
  );
  app.post(
    "/merchant/categories",
    checkJwtMidWare,
    CategoriesController.pushCategorytoMerchant
  );

  app.get("/product/:id", ProductController.getProductById);
  app.put("/product/:id", checkJwtMidWare, ProductController.updateProduct);
  app.post(
    "/product",
    checkJwtMidWare,
    upload.array("photos", 5),
    ProductController.pushProductToMerchant
  );
  app.delete(
    "/product",
    checkJwtMidWare,
    ProductController.deleteProductFromMerchant
  );

  app.get("/user/cart", checkJwtMidWare, CartController.getUserCart);
  app.post("/user/cart", checkJwtMidWare, CartController.addProductCart);
  app.delete("/user/cart", checkJwtMidWare, CartController.delProductCart);

  app.get("/user/order", checkJwtMidWare, OrderController.getOrders);
  app.post("/user/order", checkJwtMidWare, OrderController.startOrder);
  app.delete("/user/order", checkJwtMidWare, OrderController.deleteOrder);

  app.get("/photo/:id", PhotoController.getPhoto);
};

export default appView;
