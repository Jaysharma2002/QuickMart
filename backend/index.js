import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import route from "./routes.js";
import authRoutes from "./auth.js";
import configurePassport from "./config/passport.js";

dotenv.config();
const app = express();

app.set('trust proxy', 1); // << IMPORTANT for secure cookies behind a proxy

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: "https://quickmartproject.onrender.com",
  credentials: true,
}));

app.options("*", cors({
    origin: 'https://quickmartproject.onrender.com',
    credentials: true,
}));

app.use(session({
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
    secure: true,
    httpOnly: true,
    sameSite: "none",
  },
}));

// Setup passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/product", route);
app.use("/auth", authRoutes);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
