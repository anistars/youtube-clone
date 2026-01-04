import express from "express";
import multer from "multer";
import Video from "../models/Video.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

/* ================= UPLOAD VIDEO ================= */

router.post(
  "/upload",
  authMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const userId = req.user.user.id;

      const {
        title = "Untitled",
        description = "",
        tags = "",
        category = "General",
        channel
      } = req.body;

      if (!req.files?.video) {
        return res.status(400).json({ message: "Video file is required" });
      }

      const videoFile = req.files.video[0];
      const thumbnailFile = req.files.thumbnail?.[0];

      const videoUrl = `/uploads/${videoFile.filename}`;
      const thumbnailUrl = thumbnailFile
        ? `/uploads/${thumbnailFile.filename}`
        : "/uploads/default-thumbnail.png";

      const tagsArray = tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      const video = new Video({
        title,
        description,
        uploader: userId,
        channel,
        videoUrl,
        thumbnailUrl,
        tags: tagsArray,
        category
      });

      await video.save();
      res.status(201).json(video);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= GET ALL VIDEOS ================= */

router.get("/", async (req, res) => {
  try {
    const { q, category, page = 1, limit = 12 } = req.query;

    const filter = {};

    // 🔍 TITLE SEARCH (EXACT & CASE-INSENSITIVE)
    if (q && q.trim() !== "") {
      filter.title = { $regex: q, $options: "i" };
    }

    // 📁 CATEGORY FILTER
    if (category && category.trim() !== "") {
      filter.category = category;
    }

    const videos = await Video.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("uploader", "username");

    res.json(videos);
  } catch (error) {
    console.error("VIDEO FETCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


/* ================= GET SINGLE VIDEO ================= */

router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("uploader", "username avatarUrl")
      .populate("channel", "name");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json({
      ...video.toObject(),
      likeCount: video.likes.length,
      dislikeCount: video.dislikes.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= INCREASE VIEW COUNT ================= */

router.post("/:id/view", async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json({ views: video.views });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LIKE VIDEO ================= */

router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user.id;

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId }
      },
      { new: true }
    );

    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= DISLIKE VIDEO ================= */

router.post("/:id/dislike", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user.id;

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId }
      },
      { new: true }
    );

    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add comment
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.comments.push({
      user: req.user.user.id,
      text
    });

    await video.save();

    await video.populate("comments.user", "username");

    res.status(201).json(video.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("comments.user", "username");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(video.comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET MY VIDEOS ================= */

router.get("/my/videos", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user.id;

    const videos = await Video.find({ uploader: userId })
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (err) {
    console.error("MY VIDEOS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE VIDEO ================= */

router.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const userId = req.user.user.id;
      const videoId = req.params.id;

      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // 🔐 Ownership check
      if (video.uploader.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const {
        title,
        description,
        tags,
        category
      } = req.body;

      // ✏️ Update text fields
      if (title) video.title = title;
      if (description) video.description = description;
      if (category) video.category = category;

      if (tags) {
        video.tags = tags.split(",").map(t => t.trim()).filter(Boolean);
      }

      // 🖼 Thumbnail update
      if (req.files?.thumbnail) {
        video.thumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;
      }

      // 🎥 Video replacement (optional)
      if (req.files?.video) {
        video.videoUrl = `/uploads/${req.files.video[0].filename}`;
      }

      await video.save();

      res.json(video);
    } catch (err) {
      console.error("UPDATE VIDEO ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


/* ================= DELETE VIDEO ================= */

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user.id;
    const videoId = req.params.id;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // 🔐 Ownership check
    if (video.uploader.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await video.deleteOne();

    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("DELETE VIDEO ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
