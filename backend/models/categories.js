import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 300,
  },
  merchants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
  ],
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photos",
  },
});

const Categories = mongoose.model("Categories", categoriesSchema);
export default Categories;
