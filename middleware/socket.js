// Import session controller
const {session} = require("../class/controller.js")

// Authentification for socket sessions within users
function auth(socket, next) {
    // Get token from headers from handshake
    const token = socket.handshake.headers.token;

    // Check if contains ant token else error
    if(!token) {
        return next(new Error("No token provided"));
    }

    // Find bound session
    const sesh = session.getSessionByToken(token);

    // If no bound session found error
    if(!sesh) {
        return next(new Error("No session"));
    }

    // Set token to socket
    socket.token = token;

    next();
}

// Called on connection
function connect(socket, next) {
    // Add socket to session
    session.addSocketByToken(socket.id, socket.token);

    next();
}

// Called on dicornnect
function diconnect(socket, next) {
    socket.on("disconnect", () => {
        // Remove socket from session
        session.removeSocketByToken(socket.id, socket.token);
    });

    next();
}

// Export modules form socket middleware
module.exports = {auth, connect, diconnect};