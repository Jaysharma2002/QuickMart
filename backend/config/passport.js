import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {User} from "../Schema.js";

export default function configurePassport() {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://quickmartproject-backend.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
      let user = await User.findOne({ provider: "google", provider_id: profile.id });

      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          user.provider = "google";
          user.provider_id = profile.id;
          await user.save();
        } else {
          user = await User.create({
            provider: "google",
            provider_id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profileimage: profile.photos[0].value,
            address: "",
            phone: "",
            gender: "",
            age: ""
          });
        }
      }

      return done(null, user);
    } catch (err) {
        return done(err, null);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}
