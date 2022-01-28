require("dotenv").config();
const router = require("./src/routes");
const express = require("express");

const app = express();
const PORT = 3050;

app.use(express.json());

app.use("/api/v1/", router);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
