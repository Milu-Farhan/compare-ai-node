import mongoose from "mongoose";

const modelsSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
    },
    RPM: {
      type: Number,
      unique: true,
      required: true,
    },
    RPD: {
      type: Number,
      required: true,
    },
    TPM: {
      type: Number,
      required: true,
    },
    input_cost: {
      type: Array,
      required: true,
    },
    output_cost: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Models", modelsSchema);
