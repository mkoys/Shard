// Import settings
const settings = require("../settings.js");

// Import NPM modules
const { nanoid } = require("nanoid");

// Session Class
class Session {
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
        });

        // Return token
        return token;
    }
}

// Create instace session object
const session = new Session();

// Return this global class in get function
function get() {
    return session;
}

// Export the get function
module.exports = get;
