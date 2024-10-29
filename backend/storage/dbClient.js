#!/usr/bin/env node

import mongoose from "mongoose";
import crypto from "crypto";
import User from "../models/user.js";
import Merchant from "../models/marchant.js";
import {
  MissingParamsError,
  UserValidationError,
  Unauthorized,
  NotFound,
  BadRequest,
  MerchantValidationError,
} from "./storageErrors.js";

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
    const user = await User.findById(userId);
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

    const isUpdated = Object.keys(newObj).some((key) => {
      return user[key] !== updated[key];
    });
    // here is the check of update is succesful
    if (!isUpdated) throw new BadRequest("Not Updated");

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
   * @returns Merchants object
   */
  async getAllMerchantByUserId(userId) {
    // getUserById validate paramter and throw error if found
    const user = await this.getUserById(userId);
    await user.populate("merchants");
    return user.merchants;
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
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) throw new NotFound("merchant");
    // if merchant is not belong to user thorw Notfound, 404
    if (!user.merchants.includes(merchant._id)) throw new NotFound("merchant");
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

    // check if updated or Not
    const isUpdated = Object.keys(newObj).some((key) => {
      return checkMerchant[key] !== updated[key];
    });
    if (!isUpdated) throw new BadRequest("Not Updated");
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

const dataBaseClient = new DataBaseClient();
export default dataBaseClient;
