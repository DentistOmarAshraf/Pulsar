#!/usr/bin/env node

import mongoose from "mongoose";
import crypto from "crypto";
import User from "../models/user.js";
import Merchant from "../models/marchant.js";
import Categories from "../models/categories.js";
import Products from "../models/product.js";
import Cart from "../models/cart.js";
import {
  MissingParamsError,
  UserValidationError,
  Unauthorized,
  NotFound,
  BadRequest,
  MerchantValidationError,
} from "./storageErrors.js";
import Order from "../models/order.js";

class DataBaseClient {
  /**
   * constructor - connecting to database
   */
  constructor() {
    mongoose
      .connect("mongodb://127.0.0.1:27017/Pulsar")
      .then(() => {})
      .catch((err) => {
        console.log(err.message);
      });
  }
  /*********** USER CRUD **************/
  /**
   * Adding user to database
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} email
   * @param {string} password
   * @returns User Object {id.toString(), email}
   */
  async addUser(firstName, lastName, email, password) {
    // Check firstName, lastName, email, password parameter has been passed
    // if any missing throw error with missing
    if (!firstName || !firstName.length) {
      throw new MissingParamsError("First Name");
    }
    if (!lastName || !lastName.length) {
      throw new MissingParamsError("Last Name");
    }
    if (!email || !email.length) {
      throw new MissingParamsError("Email");
    }
    if (!password || !password.length) {
      throw new MissingParamsError("Password");
    }

    // Check if User Alerady exists
    const chkUser = await User.findOne({ email });
    if (chkUser) throw new BadRequest("Email is already created");

    // Saving User to database and return {id.toString(), email}
    try {
      const user = new User({
        firstName,
        lastName,
        email,
        password: crypto.createHash("sha1").update(password).digest("hex"),
      });
      const theUser = await user.save();
      return {
        id: theUser._id.toString(),
        email: theUser.email,
      };
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new UserValidationError(error);
      } else {
        throw error;
      }
    }
  }

  /**
   * checkUser - function for login porpeses
   * @param {string} email
   * @param {string} password
   * @returns User Object {id.toString(), email}
   */
  async checkUser(email, password) {
    // Check email, password parameter has been passed
    // if any missing throw error with missing
    if (!email || !email.length) throw new MissingParamsError("Email");
    if (!password || !password.length) throw new MissingParamsError("Password");

    // check if user is registerd or not
    const user = await User.findOne({ email });
    if (!user) throw new Unauthorized("Email");

    // check Password of user
    const chkPass = crypto.createHash("sha1").update(password).digest("hex");
    if (user.password === chkPass) {
      return {
        id: user._id.toString(),
        email: user.email,
      };
    }
    // if Password is wrong
    throw new Unauthorized("Password");
  }

  /**
   * getUserById - getting user object by id
   * @param {string} userId
   * @returns User Object
   */
  async getUserById(userId) {
    // Check userId parameter has been passed
    // if any missing throw error with missing
    if (!userId || !userId.length) throw new MissingParamsError("id");
    const user = await User.findById(userId).select("-password -merchants");
    if (!user) throw new NotFound("User");
    return user;
  }

  /**
   * updateUserById - updating user attribute
   * @param {string} userId
   * @param {object} newObj
   * @returns
   */
  async updateUserById(userId, newObj) {
    if (!userId || !userId.length) {
      throw new MissingParamsError("id");
    }
    if (Object.keys(newObj).includes("_id")) {
      throw new BadRequest("Can't update id");
    }
    if (Object.keys(newObj).includes("email")) {
      throw new BadRequest("Can't update Email");
    }
    // getting user to check old document if it's updated or not
    const user = await this.getUserById(userId);
    const updated = await User.findByIdAndUpdate(
      userId,
      { ...newObj },
      { new: true }
    );
    if (!updated) throw new NotFound("User");

    return {
      id: updated._id.toString(),
      email: updated.email,
    };
  }

  /**
   * deleteUserById - delete user from database
   * @param {string} userId
   * @returns empty object
   */
  async deleteUserById(userId) {
    if (!userId || !userId.length) throw new MissingParamsError("id");
    const result = await User.findByIdAndDelete(userId);
    if (!result) throw new NotFound("User");
    return {};
  }
  /*********** END User CRUD **************/

  /*********** Merchant CRUD **************/
  /**
   * addMerchantByUserID - adding a new Merchant to user
   * @param {string} userId
   * @param {string} name
   * @param {string} address
   * @returns Merchant Object
   */
  async addMerchantByUserId(userId, name, address) {
    if (!userId || !userId.length) throw new MissingParamsError("user id");
    if (!name || !name.length) throw new MissingParamsError("name");
    if (!address || !address.length) throw new MissingParamsError("address");
    try {
      const user = await this.getUserById(userId);
      const newMerchant = await new Merchant({ name, address, user: user._id });
      await newMerchant.save();
      user.merchants.push(newMerchant._id);
      await user.save();
      await this.updateUserById(userId, { role: "merchant" });
      return {
        id: newMerchant._id.toString(),
        name: newMerchant.name,
        address: newMerchant.address,
      };
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new MerchantValidationError(error);
      } else {
        throw error;
      }
    }
  }

  /**
   * getAllMerchantByUserId - get all merchant of user
   * @param {string} userId
   * @param {number} page
   * @param {number} size
   * @returns Merchants object
   */
  async getAllMerchantByUserId(userId, page = 1, size = 10) {
    // getUserById validate paramter and throw error if found
    if (page < 1 || size < 1) throw new BadRequest("Pagnation Error");
    const user = await this.getUserById(userId);
    const merchants = await Merchant.find({ user: user._id })
      .select("-categories -products -__v")
      .skip((page - 1) * size)
      .limit(size)
      .exec();
    const total = await Merchant.find({ user: user._id })
      .countDocuments()
      .exec();
    return {
      page,
      totalPages: Math.ceil(total / size),
      merchants,
    };
  }

  /**
   * getMerchantByUserId - return spacific Merchant
   * @param {string} userId
   * @param {string} merchantId
   * @returns Mercant object
   */
  async getMerchantByUserId(userId, merchantId) {
    // Missing Paramter Check
    if (!userId || !userId.length) {
      throw new MissingParamsError("user id");
    }
    if (!merchantId || !merchantId.length) {
      throw new MissingParamsError("merchant id");
    }
    // Getting user to check if the merchant belong to him
    const user = await this.getUserById(userId);
    const merchant = await Merchant.findOne({
      user: user._id,
      _id: new mongoose.Types.ObjectId(merchantId),
    }).select("-products");
    if (!merchant) throw new NotFound("merchant");
    return merchant;
  }

  /**
   * updateMerchantByUserId - update Marchent
   * @param {string} userId
   * @param {string} merchantId
   * @param {object} newObj
   * @returns Merchent Object
   */
  async updateMerchantByUserId(userId, merchantId, newObj) {
    if (Object.keys(newObj).includes("_id")) {
      throw new BadRequest("Can't update id");
    }
    // Using getMerchantByUserId to check
    const checkMerchant = await this.getMerchantByUserId(userId, merchantId);
    // if preivous line fail it will raise errors in the method
    const updated = await Merchant.findByIdAndUpdate(
      merchantId,
      { ...newObj },
      { new: true }
    );
    if (!updated) throw new NotFound("Merchent");
    return updated;
  }

  /**
   * deleteMerchantByUserId - delete merchant by userId and merchantId
   * @param {string} userId
   * @param {string} merchantId
   * @returns Empty Object if success
   */
  async deleteMerchantByUserId(userId, merchantId) {
    // using getMerchantByUserId to check if merchant is belong to user
    // the method will raise errors
    await this.getMerchantByUserId(userId, merchantId);
    const result = await Merchant.findByIdAndDelete(merchantId);
    if (!result) throw new NotFound("Merchant");
    return {};
  }
  /*********** END Merchant CRUD **************/

  /************ Categories CRUD ***************/
  /**
   * addNewCategory - add new Category to database
   * @param {string} name
   * @param {string} description
   * @returns category Object
   */
  async addNewCategory(name, description) {
    if (!name || !name.length) {
      throw new MissingParamsError("name");
    }
    if (!description || !description.length) {
      throw new MissingParamsError("description");
    }
    const category = new Categories({ name, description });
    return await category.save();
  }

  /**
   * getCategoryById - get category by id
   * @param {string} categoryId
   * @returns Category object
   */
  async getCategoryById(categoryId) {
    if (!categoryId || !categoryId.length) {
      throw new MissingParamsError("category id");
    }
    const category = await Categories.findById(categoryId);
    if (!category) {
      throw new NotFound("category");
    }
    return category;
  }

  /**
   * updateCategoryById - update info in category
   * @param {string} categoryId
   * @param {Object} newObj
   * @returns category Object
   */
  async updateCategoryById(categoryId, newObj) {
    // use method for error detication
    if (Object.keys(newObj).includes("_id")) {
      throw new BadRequest("Can't update id");
    }
    const check = await this.getCategoryById(categoryId);
    const updated = await Categories.findByIdAndUpdate(
      categoryId,
      { ...newObj },
      { new: true }
    );
    if (!updated) throw new NotFound("Category");
    return updated;
  }

  /**
   * getMerchantCategories - return available categories
   * @param {string} userId
   * @param {string} merchantId
   * @returns Array of categories available at merchant
   */
  async getMerchantCategories(userId, merchantId) {
    // use method for error detication
    const merchant = await this.getMerchantByUserId(userId, merchantId);
    await merchant.populate("categories");
    return merchant.categories;
  }

  /**
   * addCategoryToMerchant - add category to merchant
   * @param {string} userId
   * @param {string} merchantId
   * @param {string} categoryId
   * @returns Merchent Object
   */
  async addCategoryToMerchant(userId, merchantId, categoryId) {
    // Used the methods for error detication
    const merchant = await this.getMerchantByUserId(userId, merchantId);
    const category = await this.getCategoryById(categoryId);
    // previous lines will raise errors if any attribute

    await Merchant.findByIdAndUpdate(
      merchantId,
      { $addToSet: { categories: category._id } },
      { new: true }
    );

    await Categories.findByIdAndUpdate(
      categoryId,
      { $addToSet: { merchants: merchant._id } },
      { new: true }
    );
    const updated = await Merchant.findById(merchantId).populate("categories");
    return updated;
  }

  /**
   * deleteCategoryFromMerchant - delete from marchant categories
   * @param {string} userId
   * @param {string} merchantId
   * @param {string} categoryId
   * @returns
   */
  async deleteCategoryFromMerchant(userId, merchantId, categoryId) {
    // Used the methods for error detication
    const merchant = await this.getMerchantByUserId(userId, merchantId);
    const category = await this.getCategoryById(categoryId);
    // previous lines will raise errors if any attribute
    if (!merchant.categories.includes(category._id)) {
      throw new NotFound("Category");
    }
    let index = merchant.categories.indexOf(category._id);
    merchant.categories.splice(index, 1);
    await merchant.save();
    index = category.merchants.indexOf(merchant._id);
    category.merchants.splice(index, 1);
    await category.save();
    return merchant;
  }

  /**
   * deleteCategoryFromDb - delete from database and from merchants
   * @param {string} categoryId
   * @returns empty object
   */
  async deleteCategoryFromDb(categoryId) {
    const category = await Categories.findById(categoryId).populate(
      "merchants"
    );
    if (!category) throw new NotFound("Category");
    // return category;
    for (const merchant of category.merchants) {
      // @ts-ignore
      const userId = merchant.user.toString();
      await this.deleteCategoryFromMerchant(
        userId,
        merchant._id.toString(),
        categoryId
      );
    }
    await Categories.findByIdAndDelete(categoryId);
    return {};
  }

  async getAllCategories(page = 1, size = 10) {
    if (page < 1 || size < 1) throw new BadRequest("Pagnation Error");
    const categories = await Categories.find()
      .select("-products")
      .populate({ path: "merchants", select: "-categories -products" })
      .skip((page - 1) * size)
      .limit(size)
      .exec();

    const total = await Categories.countDocuments();
    return {
      page,
      totalPages: Math.ceil(total / size),
      categories,
    };
  }
  /************ End Categories CRUD ***************/

  /*************** Products CRUD ******************/
  /**
   * addNewProductToMerchant - add new Product
   * @param {string} userId
   * @param {string} merchantId
   * @param {string} categoryId
   * @param {Object} productObj
   * @returns Product Object
   */
  async addNewProductToMerchant(userId, merchantId, categoryId, productObj) {
    const merchant = await this.getMerchantByUserId(userId, merchantId);
    const merchantCategories = await this.getMerchantCategories(
      userId,
      merchantId
    );
    const category = await this.getCategoryById(categoryId);
    // check if category is in merchant categories
    const check = merchantCategories.some((merchant) =>
      category._id.equals(merchant._id)
    );
    if (!check) throw new BadRequest("Merchant Doesn't have category");
    const newProduct = {
      name: productObj.name,
      description: productObj.description,
      price: productObj.price,
      inStock: productObj.inStock,
      number: productObj.number,
      merchant: merchant._id,
      category: category._id,
    };
    for (const [key, value] of Object.entries(newProduct)) {
      if (value === undefined || value === null) {
        throw new MissingParamsError(key);
      }
    }
    const product = new Products(newProduct);
    await product.save();
    merchant.products.push(product._id);
    await merchant.save();
    category.products.push(product._id);
    await category.save();
    return product;
  }

  async getProductById(productId) {
    if (!productId || !productId.length) {
      throw new MissingParamsError("product id");
    }
    const product = await Products.findById(productId)
      .populate({ path: "category", select: "name description" })
      .populate({ path: "merchant", select: "name address isActive" });
    if (!product) throw new NotFound("product");
    return product;
  }

  /**
   *
   * @param {string} userId
   * @param {string} merchentId
   * @param {string} productId
   * @param {Object} newObj
   */
  async updateProduct(userId, merchentId, productId, newObj) {
    // error check by prevoius method
    const merchant = await this.getMerchantByUserId(userId, merchentId);
    const product = await this.getProductById(productId);
    if (product.merchant?._id.toString() !== merchant._id.toString()) {
      throw new Unauthorized("E-mail or password - Update Unauthorized");
    }
    for (const [key, value] of Object.entries(newObj)) {
      if (key === "_id" || key === "merchant" || key === "category") {
        throw new BadRequest(`${key} unable to be updated`);
      }
    }
    const updated = await Products.findByIdAndUpdate(
      productId,
      { ...newObj },
      { new: true }
    );
    if (!updated) throw new BadRequest("Not Updated");
    return updated;
  }

  async deleteProduct(userId, merchantId, productId) {
    const merchant = await this.getMerchantByUserId(userId, merchantId);
    const product = await this.getProductById(productId);
    if (product.merchant?._id.toString() !== merchant._id.toString()) {
      throw new Unauthorized("E-mail or password - Update Unauthorized");
    }
    const deleted = await Products.findByIdAndDelete(productId);
    if (!deleted) {
      throw new NotFound("Product");
    }
    await Merchant.findByIdAndUpdate(merchantId, {
      $pull: { products: product._id },
    });

    await Categories.findByIdAndUpdate(product.category?._id, {
      $pull: { products: product._id },
    });
    return {};
  }

  async getAllProductsByCategoryId(categoryId, page = 1, size = 20) {
    const category = await this.getCategoryById(categoryId);
    const products = await Products.find({ category: category._id })
      .populate({
        path: "merchant",
        select: "name address isActive",
      })
      .skip((page - 1) * size)
      .limit(size)
      .exec();
    const totalDocs = await Products.countDocuments({ category: category._id });
    return {
      page,
      totalPages: Math.ceil(totalDocs / size),
      products,
    };
  }

  /**
   * getProductsInMerchant - get product in merchant
   * @param {string} merchantId
   * @param {number} page
   * @param {number} size
   * @returns Products Object
   */
  async getProductsInMerchant(merchantId, page = 1, size = 10) {
    if (!merchantId || !merchantId.length) {
      throw new MissingParamsError("merchant id");
    }
    if (page < 1 || size < 1) {
      throw new BadRequest("Pagnition Error");
    }
    const products = await Products.find({
      merchant: new mongoose.Types.ObjectId(merchantId),
    })
      .skip((page - 1) * size)
      .limit(size)
      .exec();

    if (!products) {
      throw new NotFound("merchant");
    }
    const total = await Products.find({
      merchant: new mongoose.Types.ObjectId(merchantId),
    })
      .countDocuments()
      .exec();
    return {
      page,
      totalPages: Math.ceil(total / size),
      products,
    };
  }
  /************ End Products CRUD ***************/

  /**************** Cart CRUD *******************/
  /**
   *
   * @param {string} userId
   */
  async getCartByUserId(userId) {
    const user = await this.getUserById(userId);
    const cart = await Cart.findOne({ user: user._id })
      .populate("items")
      .exec();
    if (!cart) {
      throw new NotFound("cart");
    }
    return cart;
  }
  /**
   *
   * @param {string} userId
   * @param {string} productId
   * @param {number} quantity
   */
  async addProductToCart(userId, productId, quantity = 1) {
    if (quantity < 1) {
      throw new BadRequest("quantity can't be less than 1");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new Unauthorized("user not Found");
    }
    let cart = await Cart.findOneAndUpdate(
      { user: user._id },
      { $setOnInsert: { user: user._id, items: [] } },
      { upsert: true, new: true }
    );
    if (user.cart !== cart._id) {
      user.cart = cart._id;
      await user.save();
    }
    const product = await Products.findOne({
      _id: new mongoose.Types.ObjectId(productId),
    });
    if (!product) {
      throw new NotFound("Product");
    }
    let checkItem = false;
    cart.items.forEach((item) => {
      if (item.product?.toString() === product._id.toString()) {
        checkItem = true;
        item.quantity += quantity;
      }
    });
    if (!checkItem) {
      cart.items.push({ product: product._id, price: product.price, quantity });
    }
    await cart.populate("items.product");
    cart.total = cart.items.reduce(
      // @ts-ignore
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    await user.save();
    await cart.save();
    return cart;
  }

  /**
   *
   * @param {string} userId
   * @param {string} productId
   */
  async deleteProductFromCart(userId, productId, quantity = 1) {
    if (quantity < 1) {
      throw new BadRequest("quantity can't be less than 1");
    }
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) throw new NotFound("Cart");

    const itemIndex = cart.items.findIndex(
      // @ts-ignore
      (item) => item.product._id.toString() === productId
    );
    if (itemIndex === -1) throw new NotFound("Product in cart");

    if (cart.items[itemIndex].quantity > quantity) {
      cart.items[itemIndex].quantity -= quantity;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    cart.total = cart.items.reduce(
      // @ts-ignore
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    await cart.save();
    return cart;
  }
  /************ End Cart CRUD ***************/

  /************ Order CRUD ****************/
  async startOrder(userId, orderDetils) {
    const details = {
      paymentMethod: orderDetils.paymentMethod,
      shippingAddress: orderDetils.shippingAddress,
    };
    for (const [key, value] of Object.entries(details)) {
      if (value === null || value === undefined) {
        throw new MissingParamsError(key);
      }
    }
    const user = await this.getUserById(userId);
    let order = await Order.findOneAndUpdate(
      { user: user._id },
      {
        $setOnInsert: {
          user: user._id,
          items: [],
          paymentMethod: details.paymentMethod,
          shippingAddress: details.shippingAddress,
          totalAmount: 0,
        },
      },
      { upsert: true, new: true }
    );
    await order.save();
    if (user.order !== order._id) {
      user.order = order._id;
      await user.save();
    }
    const cart = await Cart.findOne({ user: user._id })
      .populate("items.product")
      .exec();
    if (!cart) {
      throw new NotFound("Cart");
    }
    if (!cart.items.length) {
      throw new NotFound("No Product in the cart");
    }
    for (let x = 0; x < cart.items.length; x++) {
      order.items.push(cart.items[x]);
      await this.deleteProductFromCart(
        userId,
        // @ts-ignore
        cart.items[x].product?._id.toString(),
        cart.items[x].quantity
      );
    }
    order.totalAmount += cart.total;
    await order.save();
    return order;
  }
  async getOrderByUserId(userId) {
    const order = await Order.findOne({ user: userId });
    if (!order) {
      throw new NotFound("No Orders Found");
    }
    return order;
  }

  async deleteOrderByUserId(userId) {
    const deleted = await Order.deleteOne({ user: userId });
    if (!deleted.deletedCount) {
      throw new NotFound("No Orders Found");
    }
    return {};
  }
}

const dataBaseClient = new DataBaseClient();
export default dataBaseClient;
