// Import settings
const settings = require("../settings.js");

// Import NPM modules
const { nanoid } = require("nanoid");

// Export Session Class
module.exports = class Session {
    constructor() {
        this.sessions = []; // All sessions on this instance
    }

    // Creates new session and returns token
    create(user) {
        // Deconstruct data
        const { username, _id } = user;

        // Generate token with proper length
        const token = nanoid(settings.session.tokenLength || 6);

        // Push new session into session array
        this.sessions.push({
            id: _id,
            username,
            token: token,
            createAt: new Date().getTime(),
            sockets: []
        });

        // Return token
        return token;
    }

    addSocketByToken(socket, token) {
        const index = this.getSessionIndexByToken(token);

        this.sessions[index].sockets.push(socket);
    }

    removeSocketByToken(socket, token) {
        const sessionIndex = this.getSessionIndexByToken(token);

        const socketIndex = this.sessions[sessionIndex].sockets.indexOf(socket);

        this.sessions[sessionIndex].sockets.splice(socketIndex, 1);
    }

    getSessionById(id) {
        const index = this.sessions.findIndex(item => item.id == id);

        return this.sessions[index];
    }

    getSessionIndexByToken(token) {
        return this.sessions.findIndex(item => item.token == token);
    }

    getSessionByToken(token) {
        const index = this.sessions.findIndex(item => item.token == token);

        return this.sessions[index];
    }
}
