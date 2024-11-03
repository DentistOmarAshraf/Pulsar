import mongoose from "mongoose";
import { ProductClient } from "./productClient.js";
import User from "../models/user.js";
import Cart from "../models/cart.js";
import Products from "../models/product.js";
import { NotFound, BadRequest, Unauthorized } from "./storageErrors.js";

export class CartClient extends ProductClient {
  /**************** Cart CRUD *******************/
  /**
   *
   * @param {string} userId
   */
  async getCartByUserId(userId) {
    const user = await this.getUserById(userId);
    let cart = await Cart.findOne({ user: user._id }).populate("items").exec();
    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
      await cart.save();
    }
    await cart.populate("items.product");
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
}

const cartClient = new CartClient();
export default cartClient;
