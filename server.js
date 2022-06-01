import express from "express";

const port = parseInt(process.env.PORT || "8080");

const app = express();
app.use(express.json({ limit: "50mb" }));

app.get("/isAlive|isReady", (req, res) => res.sendStatus(200));
app.use(express.static('public'))

app.listen(port);
