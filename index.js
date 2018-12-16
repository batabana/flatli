const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const db = require("./config/db.js");
const csurf = require("csurf");
const dvb = require("dvbjs");
const moment = require("moment");

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
        res.json({ success: true, data });
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
        console.log("error in get /api/users", err);
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

app.get("/api/dates/:batch", async (req, res) => {
    const top = req.params.batch * 5;
    const bottom = top - 4;
    try {
        const dates = await db.getDateBatch(bottom, top);
        dates.map(item => {
            item.start = moment(item.start).format("DD.MM.YY");
            item.end = moment(item.end).format("DD.MM.YY");
            return item;
        });
        res.json({ success: true, dates });
    } catch (err) {
        console.log("error in get /api/dates/batch", err);
        res.json({ success: false });
    }
});

app.get("/api/all-dates", async (req, res) => {
    try {
        const dates = await db.getAllDates();
        res.json({ success: true, dates });
    } catch (err) {
        console.log("error in get /api/all-dates", err);
        res.json({ success: false });
    }
});

app.post("/api/add-date", async (req, res) => {
    try {
        const { start, end, title } = req.body;
        const date = await db.saveDate(title, start, end);
        date[0].start = moment(date[0].start).format("DD.MM.YY");
        date[0].end = moment(date[0].end).format("DD.MM.YY");
        res.json({ success: true, date });
    } catch (err) {
        console.log("error in get /api/add-date", err);
        res.json({ success: false });
    }
});

app.get("/api/delete-date/:id", async (req, res) => {
    try {
        await db.deleteDate(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.log("error in get /api/delete-date", err);
        res.json({ success: false });
    }
});

app.get("/api/all-drinks", async (req, res) => {
    try {
        const drinks = await db.getAllDrinks(req.session.userId);
        res.json({ success: true, drinks });
    } catch (err) {
        console.log("error in get /api/all-drinks", err);
        res.json({ success: false });
    }
});

app.get("/api/add-drink/:id", async (req, res) => {
    const user = req.session.userId;
    const drink = req.params.id;
    try {
        await db.saveDrink(user, drink);
        res.json({ success: true });
    } catch (err) {
        console.log("error in get /api/add-drink", err);
        res.json({ success: false });
    }
});

app.post("/api/clear-check", async (req, res) => {
    const user = req.session.userId;
    const newCredit = req.body.newCredit;
    try {
        await db.clearDebts(user);
        await db.updateCredit(user, newCredit);
        res.json({ success: true });
    } catch (err) {
        console.log("error in get /api/clear-check", err);
        res.json({ success: false });
    }
});

app.post("/api/update-credit", async (req, res) => {
    const user = req.session.userId;
    const newCredit = req.body.newCredit;
    if (isNaN(newCredit)) {
        res.json({ success: false });
    } else {
        try {
            await db.updateCredit(user, newCredit);
            res.json({ success: true });
        } catch (err) {
            console.log("error in get /api/update-credit", err);
        }
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
