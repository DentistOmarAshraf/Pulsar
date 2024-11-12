import express from "express";
import cors from "cors";
import appView from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
appView(app);

app.listen(5001, "0.0.0.0", () => {
  console.log("go");
});
