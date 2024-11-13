#!/usr/bin/env node

import mongoose from "mongoose";

export default class DataBaseClient {
  /**
   * constructor - connecting to database
   */
  static connection = null;
  constructor() {
    if (!DataBaseClient.connection) {
      //@ts-ignore
      DataBaseClient.connection = mongoose
        .connect("mongodb://127.0.0.1:27017/Pulsar")
        .then(() => {
          console.log("Connected to Mongodb");
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }
}
