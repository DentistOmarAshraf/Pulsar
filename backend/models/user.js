#!/usr/bin/env node

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "merchant"],
    default: "user",
  },
  merchants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
    },
  ],
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
});

const User = mongoose.model("User", userSchema);
export default User;
