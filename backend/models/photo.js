import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
});

const Photos = mongoose.model("Photos", photoSchema);
export default Photos;
