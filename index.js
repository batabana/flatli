const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const db = require("./config/db.js");
const csurf = require("csurf");
const dvb = require("dvbjs");

// setup bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup middleware to parse cookies
if (!process.env.COOKIE_SECRET) {
    var secrets = require("./config/secrets.json");
}
const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: process.env.COOKIE_SECRET || secrets.cookieSecret,
        // delete after 2hr
        maxAge: 1000 * 60 * 60 * 2
    })
);

// setup middleware to prevent csrf-attack
app.use(csurf());
app.use((req, res, next) => {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// serve static files
app.use(express.static("./public"));

// setup compression
app.use(compression());

// request for /bundle.js: serve 8081 in development | serve bundle.js that was created by webpack in production
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

// routes
app.get("/api/public", async (req, res) => {
    const stopID = "33000115"; // Wasaplatz
    var timeOffset = 0;
    var numResults = 15;

    try {
        const data = await dvb.monitor(stopID, timeOffset, numResults);
        res.json(data);
    } catch (err) {
        console.log("error in get /api/public", err);
        res.json({ success: false });
    }
});

app.get("/api/users", async (req, res) => {
    try {
        const users = await db.getUsers();
        res.json(users);
    } catch (err) {
        console.log("error in get /api/currentuser", err);
        res.json({ success: false });
    }
});

app.post("/api/login/:userId", (req, res) => {
    req.session.userId = req.params.userId;
    res.json({ success: true });
});

app.get("/api/currentuser", async (req, res) => {
    try {
        const user = await db.getUserById(req.session.userId);
        res.json(user);
    } catch (err) {
        console.log("error in get /api/currentuser", err);
        res.json({ success: false });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

// all other urls, if logged in: serve index.html
app.get("*", (req, res) => {
    if (!req.session.userId && req.url != "/login") {
        res.redirect("/login");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, "127.0.0.1", () => console.log("Listening."));
