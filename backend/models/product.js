import mongoose from "mongoose";

const procutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1024,
  },
  price: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  number: {
    type: Number,
    default: 1,
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
  },
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photos",
    },
  ],
});

const Products = mongoose.model("Products", procutSchema);
export default Products;
