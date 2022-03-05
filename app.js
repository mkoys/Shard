// Import settings
const settngs = require("./settings.js");

// Import native node modules
const http = require("http");

// Import NPM modules
const express = require("express");
const socketServer = require("socket.io").Server;

// Import Express middleware modules
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Import router
const Router = require("./router.js");

// Import database
const database = require("./connection.js");

// Create HTTP, Express, Socket.io server 
const app = express();
const server = http.createServer(app);
const io = new socketServer(server);

// Initialize database
database.init(settngs.databaseUrl, "shard");

// Port constant
const port = settngs.port || "8000";

// Create router object
const router = new Router();

// Add modules to applicaiton
router.addRoute("./module/auth/auth.js", "/auth");

// Use Express middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));

// User our router
app.use("/", router.app);

// Hello world route
app.get("/", (req, res) => {
    res.json({ message: "Hello shard!" });
});

// HTTP, Socket.io, Express listen on port
server.listen(port, () => console.log(`Running on http://localhost:${port}`));