const {session} = require("../class/controller.js")

function auth(socket, next) {
    const token = socket.handshake.headers.token;

    if(!token) {
        return next(new Error("No token provided"));
    }

    const sesh = session.getSessionByToken(token);

    if(!sesh) {
        return next(new Error("No session"));
    }

    socket.token = token;

    next();
}

function connect(socket, next) {
    session.addSocketByToken(socket.id, socket.token);
    next();
}

function diconnect(socket, next) {
    socket.on("disconnect", () => {
        session.removeSocketByToken(socket.id, socket.token);
    });

    next();
}

module.exports = {auth, connect, diconnect};