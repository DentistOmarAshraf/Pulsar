import categoryClient from "../storage/categoryClient.js";
import productClient from "../storage/productClient.js";

class CategoriesController {
  static async getAllCategories(req, res) {
    try {
      const { page, size } = req.query;
      const listOfCategories = await categoryClient.getAllCategories(
        page,
        size
      );
      return res.status(200).json(listOfCategories);
    } catch (error) {
      const statuscode = error.status || 500;
      return res.status(statuscode).json({ error: error.message });
    }
  }

  static async getProductsInCategory(req, res) {
    const { id } = req.params;
    const { page, size } = req.query;
    try {
      const product = await productClient.getAllProductsByCategoryId(
        id,
        page,
        size
      );
      return res.status(200).json(product);
    } catch (error) {
      const statuscode = error.status || 500;
      return res.status(statuscode).json({ error: error.message });
    }
  }
  static async pushCategorytoMerchant(req, res) {
    const { id } = req.userData;
    const { merchantId, categoryId } = req.body;
    try {
      const merchant = await categoryClient.addCategoryToMerchant(
        id,
        merchantId,
        categoryId
      );
      return res.status(201).json(merchant);
    } catch (error) {
      const statuscode = error.status;
      return res.status(statuscode).json({ error: error.message });
    }
  }
}

export default CategoriesController;
