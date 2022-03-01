const settngs = require("./settings.js");

const http = require("http");

const express = require("express");
const socketServer = require("socket.io").Server;

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const Router = require("./router.js");

const app = express();

const server = http.createServer(app);

const io = new socketServer(server);

const port = settngs.port || "8000";

const router = new Router();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));

app.use("/", router.app);

app.get("/", (req, res) => {
    res.json({ message: "Hello shard!" });
});

server.listen(port, () => console.log(`Running on http://localhost:${port}`));