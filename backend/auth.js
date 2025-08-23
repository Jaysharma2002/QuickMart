import express from "express";
import passport from "passport";
import { logout } from "./Controller.js";

const router = express.Router();

// Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "https://ecommerce-web-app-in-mern.onrender.com/" }),
  (req, res) => {
    req.session.userId = req.user._id;
    req.session.save(() => {
      res.redirect("https://ecommerce-web-app-in-mern.onrender.com/home");
    });
  }
);

router.get("/logout", logout);

router.get("/me", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ success: true, user: req.user, userId: req.session.userId });
  }
  return res.status(401).json({ success: false, message: "Not authenticated" });
});

export default router;
