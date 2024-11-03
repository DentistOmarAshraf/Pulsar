import { CartClient } from "./cartClient.js";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import { MissingParamsError, NotFound } from "./storageErrors.js";

export class OrderClient extends CartClient {
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
      throw new NotFound("Product in the cart");
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
      throw new NotFound("Order");
    }
    return order;
  }

  async deleteOrderByUserId(userId) {
    const deleted = await Order.deleteOne({ user: userId });
    if (!deleted.deletedCount) {
      throw new NotFound("Order");
    }
    return {};
  }
}

const orderClient = new OrderClient();
export default orderClient;
