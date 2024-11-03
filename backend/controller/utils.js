import jwt from "jsonwebtoken";
import userClient from "../storage/userClient.js";

export default async function checkJwtMidWare(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "No Authorization header" });
  }
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid Authorization header" });
  }
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, "TEMP_KEY", { algorithms: ["HS256"] });
    //@ts-ignore
    await userClient.getUserById(decoded.id);
    req.userData = decoded;
    next();
  } catch (error) {
    if (error.name === "BadRequest") {
      return res.status(error.status).json({ error: error.message });
    }
    return res.status(403).json({ error: "Invalid Token" });
  }
}
