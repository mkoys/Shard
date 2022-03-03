// Import MongoDB client
const { MongoClient } = require("mongodb");

// Import settings
const settings = require("./settings.js");

// Create new client Object
const client = new MongoClient(settings.databaseUrl);

// Dtabase variable
let database = null;

module.exports = {
    // Inits server connection to database
    init: async () => {
        // Async connection using client
        await client.connect();

        // Log message on connection
        console.log("Connected to database");

        // Get database by name
        const db = client.db(settings.dbName);

        // Set it to database variable
        database = db;
    },
    // Return database object
    get: () => {
        return database;
    }
}                                             