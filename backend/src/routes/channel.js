import express from "express";
import User from "../models/User.js";
import Video from "../models/Video.js";

const router = express.Router();

/**
 * GET CHANNEL INFO
 * /api/channel/:userId
 */
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("username email createdAt");

    if (!user) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const videoCount = await Video.countDocuments({
      uploader: req.params.userId,
    });

    res.json({
      user,
      videoCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET CHANNEL VIDEOS
 * /api/channel/:userId/videos
 */
router.get("/:userId/videos", async (req, res) => {
  try {
    const videos = await Video.find({
      uploader: req.params.userId,
    })
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
