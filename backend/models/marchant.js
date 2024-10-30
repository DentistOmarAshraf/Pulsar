import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    address: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
  },
  { timestamps: true }
);

const Merchant = mongoose.model("Merchant", merchantSchema);
export default Merchant;
