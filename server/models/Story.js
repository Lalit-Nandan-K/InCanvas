import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String },
    media_url: { type: String },
    media_type: {
      type: String,
      enum: ["text", "image", "video"]
    },
    views_count: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    background_color:{type:String},
    expires_at: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true, minimize: false }
);

const Story = mongoose.model("Story", storySchema);

export default Story;
