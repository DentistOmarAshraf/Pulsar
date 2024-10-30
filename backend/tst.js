import dataBaseClient from "./storage/dbClient.js";
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

dataBaseClient.getAllCategories().then((data) => console.log(data));
