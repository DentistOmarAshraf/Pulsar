import mongoose from "mongoose";
import { UserClient } from "./userClient.js";
import Merchant from "../models/marchant.js";
import {
  MissingParamsError,
  MerchantValidationError,
  BadRequest,
  NotFound,
} from "./storageErrors.js";
import User from "../models/user.js";
import Categories from "../models/categories.js";

export class MerchantClient extends UserClient {
  /*********** Merchant CRUD **************/
  /**
   * addMerchantByUserID - adding a new Merchant to user
   * @param {string} userId
   * @param {string} name
   * @param {string} address
   * @returns Merchant Object
   */
  async addMerchantByUserId(
    userId,
    name,
    address,
    isActive = true,
    categories = []
  ) {
    if (!userId || !userId.length) throw new MissingParamsError("user id");
    if (!name || !name.length) throw new MissingParamsError("name");
    if (!address || !address.length) throw new MissingParamsError("address");
    try {
      const user = await this.getUserById(userId);
      const newMerchant = await new Merchant({
        name,
        address,
        user: user.id,
        isActive,
        categories,
      });
      await newMerchant.save();
      const updated = await User.findByIdAndUpdate(
        user.id,
        { $push: { merchants: newMerchant } },
        { new: true }
      );
      if (!updated) {
        throw new NotFound("User");
      }
      for (let x = 0; x < categories.length; x++) {
        await Categories.updateOne(
          { _id: categories[x] },
          { $push: { merchants: categories[x] } }
        );
      }
      await this.updateUserById(userId, { role: "merchant" });
      return {
        id: newMerchant._id.toString(),
        name: newMerchant.name,
        address: newMerchant.address,
        isActive,
        categories: newMerchant.categories,
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
      .select("-categories -products -__v -user")
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
    })
      .select("-products")
      .exec();
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
}

const merchantClient = new MerchantClient();
export default merchantClient;
