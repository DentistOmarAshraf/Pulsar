import jwt from "jsonwebtoken";
import userClient from "../storage/userClient.js";

class UserController {
  static async postUser(req, res) {
    const { firstName, lastName, email, password } = req.body;
    try {
      const newUser = await userClient.addUser(
        firstName,
        lastName,
        email,
        password
      );
      return res.status(201).json(newUser);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.details });
      }
      return res.status(error.status).json({ error: error.message });
    }
  }

  static async checkUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = await userClient.checkUser(email, password);
      const secret = "TEMP_KEY";
      const token = jwt.sign(user, secret, { algorithm: "HS256" });
      return res.status(200).json({ token });
    } catch (error) {
      res.status(error.status).json({ error: error.message });
    }
  }

  static async getUser(req, res) {
    const user = req.userData;
    try {
      const theUser = await userClient.getUserById(user?.id);
      return res.status(200).json(theUser);
    } catch (error) {
      const statusCode = error.status || 500;
      return res.status(statusCode).json({ error: error.message });
    }
  }
}

export default UserController;
