const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
require('dotenv').config();

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID || 'not-a-client-id',
			clientSecret: process.env.CLIENT_SECRET || 'not-a-client-secret',
			callbackURL: "/api/v1/google/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
            console.log(profile)
			callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});