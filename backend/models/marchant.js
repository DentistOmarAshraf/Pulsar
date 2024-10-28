import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 10,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
});

const Merchant = mongoose.model("Merchant", merchantSchema);
export default Merchant;
