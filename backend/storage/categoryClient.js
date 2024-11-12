import { MerchantClient } from "./merchantClient.js";
import Categories from "../models/categories.js";
import Merchant from "../models/marchant.js";
import Photos from "../models/photo.js";
import { MissingParamsError, NotFound, BadRequest } from "./storageErrors.js";

export class CategoryClient extends MerchantClient {
  /************ Categories CRUD ***************/
  /**
   * addNewCategory - add new Category to database
   * @param {string} name
   * @param {string} description
   * @returns category Object
   */
  async addNewCategory(name, description, photoName) {
    if (!name || !name.length) {
      throw new MissingParamsError("name");
    }
    if (!description || !description.length) {
      throw new MissingParamsError("description");
    }
    const photo = new Photos({ name: photoName });
    const afterSave = await photo.save();
    const category = new Categories({
      name,
      description,
      photo: afterSave._id,
    });
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
    const updated = await Merchant.findById(merchantId);
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
}

const categoryClient = new CategoryClient();
export default categoryClient;
