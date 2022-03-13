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

// Import session controller
const { session } = require("./class/controller.js");

// Import middleware
const socketMiddleware = require("./middleware/socket.js");

// UGLY CHANGE IT
// Initialize database then continue
database.init(settngs.databaseUrl, "shard").then(() => {
    // Create HTTP, Express, Socket.io server 
    const app = express();
    const server = http.createServer(app);
    const io = new socketServer(server);

    // Port constant
    const port = settngs.port || "8000";

    // Create router object
    const router = new Router();

    // Add modules to applicaiton
    router.addRoute("./module/auth/auth.js", "/auth");

    // Use Express middleware
    app.use(express.static("client")); // Provide our client
    app.use(express.json()); // Use JSON data
    app.use(cors()); // Cross resource origin headers
    app.use(helmet()); // Security
    app.use(morgan("tiny")); // Small http logger

    // User our router
    app.use("/api", router.app);

    // Error Handler
    app.use((err, req, res, next) => {
        res.send(err);
    });

    // Use socket middleware
    io.use(socketMiddleware.auth); // Authentification check
    io.use(socketMiddleware.connect); // Append socket to session
    io.use(socketMiddleware.diconnect); // Remove socket from session

    // HTTP, Socket.io, Express listen on port
    server.listen(port, () => console.log(`Running on http://localhost:${port}`));
});