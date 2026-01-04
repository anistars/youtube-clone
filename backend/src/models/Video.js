import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel"
    },

    videoUrl: { type: String, required: true },

    thumbnailUrl: { type: String, required: true },

    views: { type: Number, default: 0 },

    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    dislikes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        text: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    tags: [String],

    category: { type: String, default: "General" }
  },
  { timestamps: true }
);

// Text search
videoSchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.model("Video", videoSchema);
