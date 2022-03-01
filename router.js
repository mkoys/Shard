// Import NPM modules
const express = require("express");

module.exports = class Router {
    constructor() {
        this.app = express.Router(); // Holdes express router
        this.routes = []; // List of all routes in router
    }

    // Adds route and requeires it and then it uses it
    addRoute(codePath, apiPath) {
        // Append path to router list
        this.routes.push({ codePath, apiPath });

        // Require and use api end-point
        const api = require(codePath);
        this.app.use(apiPath, api);
    }
}