#!/usr/bin/env node

import mongoose from "mongoose";
import crypto from "crypto";
import User from "../models/user.js";
import {
  MissingParamsError,
  UserValidationError,
  Unauthorized,
  NotFound,
  BadRequest,
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
    if (!userId || !userId.length) throw new MissingParamsError("id");
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
}

const dataBaseClient = new DataBaseClient();
export default dataBaseClient;
