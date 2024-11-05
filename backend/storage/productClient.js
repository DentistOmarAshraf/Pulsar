import mongoose from "mongoose";
import { CategoryClient } from "./categoryClient.js";
import Products from "../models/product.js";
import Merchant from "../models/marchant.js";
import Categories from "../models/categories.js";
import {
  BadRequest,
  MissingParamsError,
  Unauthorized,
  NotFound,
} from "./storageErrors.js";

export class ProductClient extends CategoryClient {
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
      photos: productObj.photos,
    };
    for (const [key, value] of Object.entries(newProduct)) {
      if (value === undefined || value === null) {
        throw new MissingParamsError(key);
      }
    }
    const product = new Products(newProduct);
    const checkUpdated = await Merchant.findOneAndUpdate(
      { _id: merchant._id, user: userId },
      { $push: { products: product._id } },
      { new: true }
    );
    if (!checkUpdated) {
      throw new BadRequest("Not Updated");
    }
    await checkUpdated.save();
    await product.save();
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
}

const productClient = new ProductClient();
export default productClient;
