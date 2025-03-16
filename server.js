const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const fs = require("fs");
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "discord_auth"
});

db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Failed: " + err.stack);
        return;
    }
    console.log("✅ Connected to MySQL");
});

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const CLIENT_ID = "1338476573556473917";
const CLIENT_SECRET = "4vj90DlAM63QQLJ6ksdfRuH6XX00qwty";
const CALLBACK_URL = "http://localhost:53134/auth/discord/callback";

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new DiscordStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: ["identify", "email"]
}, (accessToken, refreshToken, profile, done) => {
    saveUserData(profile);
    return done(null, profile);
}));

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/discord", passport.authenticate("discord"));

app.get("/auth/discord/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("/");
    }
);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/profile", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/auth/discord");
    }

    db.query("SELECT * FROM users WHERE id = ?", [req.user.id], (err, results) => {
        if (err) {
            console.error("❌ Error fetching user:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(results[0]);
    });
});

function saveUserData(profile) {
    const query = "INSERT INTO users (id, username, discriminator, avatar, email) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE username=?, discriminator=?, avatar=?, email=?";
    
    db.query(query, [
        profile.id, profile.username, profile.discriminator, profile.avatar, profile.email,
        profile.username, profile.discriminator, profile.avatar, profile.email
    ], (err, result) => {
        if (err) {
            console.error("❌ Error saving user data:", err);
        } else {
            console.log("✅ User data saved successfully!");
        }
    });
}

const PORT = 53134;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});