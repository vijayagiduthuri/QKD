import mongoose from "mongoose";

const auctionerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Auctioner", auctionerSchema);