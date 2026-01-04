import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import Video from "../models/Video.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const seed = async () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      }).catch((error) => {
        console.log(error.message);
      });
    await Video.deleteMany({});
    await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password1234", salt);

    const user = await User.create({
        username: "JohnDoe",
        email: "john@example.com",
        passwordHash: hashedPassword,
        avatar: ''
    });

    await Video.create([
        {
            title: "Video 1",
            description: "Description 1",
            uploader: user._id,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            thumbnailUrl: "",
            views: 10,
            tags: ["tag1", "tag2"],
            category: "Education",
        },
    ]);
    console.log("Seeding completed");
    process.exit(0);
}
seed();