import productClient from "../storage/productClient.js";

class ProductController {
  static async getProductById(req, res) {
    const { id } = req.params;
    try {
      const product = await productClient.getProductById(id);
      return res.status(200).json(product);
    } catch (error) {
      const statuscode = error.status || 500;
      return res.status(statuscode).json({ error: error.message });
    }
  }

  static async pushProductToMerchant(req, res) {
    const { id } = req.userData;
    const obj = {
      merchantId: req.body.merchantId,
      categoryId: req.body.categoryId,
      name: req.body.name,
      description: req.body.description,
      inStock: req.body.inStock,
      number: req.body.number,
      price: req.body.price,
    };
    try {
      const newProduct = await productClient.addNewProductToMerchant(
        id, // userID
        obj.merchantId,
        obj.categoryId,
        obj
      );
      return res.status(201).json(newProduct);
    } catch (error) {
      const statuscode = error.status || 500;
      return res.status(statuscode).json({ error: error.message });
    }
  }

  static async deleteProductFromMerchant(req, res) {
    const { id } = req.userData;
    const { merchantId, productId } = req.body;
    try {
      const deleted = await productClient.deleteProduct(
        id,
        merchantId,
        productId
      );
      return res.status(200).json(deleted);
    } catch (error) {
      const statuscode = error.status || 500;
      return res.status(statuscode).json({ error: error.message });
    }
  }

  static async updateProduct(req, res) {
    const userId = req.userData.id;
    const { id } = req.params;
    const merchant = req.body.merchant;
    const obj = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      inStock: req.body.inStock,
      number: req.body.number,
    };
    try {
      const updated = await productClient.updateProduct(
        userId,
        merchant,
        id, // productId
        obj
      );
      return res.status(201).json(updated);
    } catch (error) {
      const statuscode = error.status || 500;
      return res.status(statuscode).json({ error: error.message });
    }
  }
}

export default ProductController;
