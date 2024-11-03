import userClient from "./storage/userClient.js";
import jwt from "jsonwebtoken";
// omar 67207fee1a57445ccb93944f
// nada 6720bb14f13293c8127a2d01
// dataBaseClient
//   .updateProduct(
//     "67207fee1a57445ccb93944f",
//     "67207fee1a57445ccb939453",
//     "67221819ad101f517a2cb8f2",
//     { number: 4 }
//   )
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));

// dataBaseClient
//   .getProductById("67221819ad101f517a2cb8f2")
//   .then((data) => console.log(data.number));

// dataBaseClient
//   .deleteProduct(
//     "67207fee1a57445ccb93944f",
//     "67207fee1a57445ccb939453",
//     "67221819ad101f517a2cb8f2"
//   )
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));
// (async () => {
//   for (let x = 0; x < 30; x++) {
//     const data = await dataBaseClient.addNewProductToMerchant(
//       "67207fee1a57445ccb93944f",
//       "67207fee1a57445ccb939453",
//       "672200e3b1f68cfadca69d15",
//       {
//         name: `Nokia n-${x}`,
//         description: "Nice Mobile Phone",
//         price: 600,
//         inStock: true,
//         number: 200,
//       }
//     );
//     console.log(data);
//   }
// })();

// dataBaseClient
//   .getProductById("67224e0c0478961ceded7d5f")
//   .then((data) => console.log(data));

// dataBaseClient
//   .getProductsInMerchant("67207fee1a57445ccb939453", 2, 3)
//   .then((data) => console.log(data));

// dataBaseClient
//   .getUserById("67207fee1a57445ccb93944f")
//   .then((data) => console.log(data));

// dataBaseClient
//   .addProductToCart("6720bb14f13293c8127a2d01", "67224e0c0478961ceded7d5f", 3)
//   .then((data) => console.log(data));

// dataBaseClient
//   .deleteOrderByUserId("6720bb14f13293c8127a2d01")
//   .then((data) => console.log(data));

// redisClient.del("some").then((data) => console.log(data));

(async () => {
  //   const user = await userClient.checkUser("omar@ashraf.com", "9344");
  const user = { id: "6722a8d9d8d62158a61f2bf7", email: "someMAIL" };
  console.log(user);
  const toke = jwt.sign(user, "TEMP_KEY", { algorithm: "HS256" });
  console.log(toke);
  console.log("-------------");
  const decoded = jwt.verify(toke, "TEMP_KEY");
  console.log(decoded);
})();

/**
 * async addUser(firstName, lastName, email, password)
 * async checkUser(email, password)
 * async getUserById(userId)
 * async updateUserById(userId, newObj)
 * async deleteUserById(userId)
 * ----------------------------
 * async addMerchantByUserId(userId, name, address)
 * async getAllMerchantByUserId(userId, page = 1, size = 10)
 * async getMerchantByUserId(userId, merchantId)
 * async updateMerchantByUserId(userId, merchantId, newObj)
 * async deleteMerchantByUserId(userId, merchantId)
 * -----------------------------
 * async addNewCategory(name, description)
 * async getCategoryById(categoryId)
 * async updateCategoryById(categoryId, newObj)
 * async getMerchantCategories(userId, merchantId)
 * async addCategoryToMerchant(userId, merchantId, categoryId)
 * async deleteCategoryFromMerchant(userId, merchantId, categoryId) **
 * async deleteCategoryFromDb(categoryId)
 * async getAllCategories(page = 1, size = 10)
 * --------------------------------
 * async addNewProductToMerchant(userId, merchantId, categoryId, productObj)
 * async getProductById(productId)
 * async updateProduct(userId, merchentId, productId, newObj)
 * async deleteProduct(userId, merchantId, productId)
 * async getAllProductsByCategoryId(categoryId, page = 1, size = 20)
 * async getProductsInMerchant(merchantId, page = 1, size = 10)
 */
