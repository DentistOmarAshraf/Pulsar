import orderClient from "../storage/orderClient.js";

class OrderController {
  static async getOrders(req, res) {
    const { id } = req.userData;
    try {
      const order = await orderClient.getOrderByUserId(id);
      return res.status(200).json(order);
    } catch (error) {
      const statuscode = error.status || 500;
      return res.status(statuscode).json({ error: error.message });
    }
  }

  static async startOrder(req, res) {
    const { id } = req.userData;
    const { paymentMethod, shippingAddress } = req.body;
    try {
      const order = await orderClient.startOrder(id, {
        paymentMethod,
        shippingAddress,
      });
      return res.status(201).json(order);
    } catch (error) {
      const statuscode = error.status || 500;
      return res.status(statuscode).json({ error: error.message });
    }
  }

  static async deleteOrder(req, res) {
    const { id } = req.userData;
    try {
      const deleted = await orderClient.deleteOrderByUserId(id);
      return res.status(200).json(deleted);
    } catch (error) {
      const statuscode = error.status || 500;
      return res.status(statuscode).json({ error: error.message });
    }
  }
}

export default OrderController;
