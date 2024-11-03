import cartClient from "../storage/cartClient.js";

class CartController {
  static async getUserCart(req, res) {
    const { id } = req.userData;
    try {
      const cart = await cartClient.getCartByUserId(id);
      return res.status(200).json(cart);
    } catch (error) {
      const statuscode = error.statuscode || 500;
      return res.status(statuscode).json({ error: error.message });
    }
  }

  static async addProductCart(req, res) {
    const { id } = req.userData;
    const { productId, quantity } = req.body;
    try {
      const cart = await cartClient.addProductToCart(id, productId, quantity);
      return res.status(201).json(cart);
    } catch (error) {
      const statusCode = error.status || 500;
      return res.status(statusCode).json({ error: error.message });
    }
  }

  static async delProductCart(req, res) {
    const { id } = req.userData;
    const { productId, quantity } = req.body;
    try {
      const cart = await cartClient.deleteProductFromCart(
        id,
        productId,
        quantity
      );
      return res.status(200).json(cart);
    } catch (error) {
      const statusCode = error.status || 500;
      return res.status(statusCode).json({ error: error.message });
    }
  }
}

export default CartController;
