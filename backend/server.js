import express from "express";
import appView from "./routes/index.js";

const app = express();

app.use(express.json());
appView(app);

app.listen(5000, "0.0.0.0", () => {
  console.log("go");
});
