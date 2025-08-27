import mongoose from "mongoose";

const auctionerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Auctioner = mongoose.model("Auctioner", auctionerSchema); // fixed
export default Auctioner;
