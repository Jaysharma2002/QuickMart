import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes.js";
import authRoutes from "./auth.js";
import configurePassport from "./config/passport.js";

dotenv.config();
const app = express();

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "https://quickmartproject.onrender.com",
    credentials: true,
  })
);

app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/product", productRoutes);
app.use("/auth", authRoutes);

// Serve frontend build
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

//SPA fallback (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(frontendPath, "index.html"));
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
