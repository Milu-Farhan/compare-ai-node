import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    modal_name: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    input_tokens: {
      type: Number,
      required: true,
    },
    output_tokens: {
      type: Number,
      required: true,
    },
    total_tokens: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    latency: {
      type: Number,
      required: true,
    },
    time_taken: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("History", historySchema);
