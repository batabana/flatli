const express = require("express");
const app = express();

app.use(require("./build.js"));

app.listen(8081, "127.0.0.1", () => console.log(`Ready to compile and serve bundle.js`));
