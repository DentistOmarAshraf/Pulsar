import categoryClient from "./storage/categoryClient.js";

categoryClient
  .addNewCategory(
    "Fashion",
    "only authentic, high-quality fashion items",
    "fashon.jpg"
  )
  .then((data) => console.log(data));
