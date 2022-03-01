const express = require("express");

module.exports = class Router {
    constructor() {
        this.app = express.Router();
        this.routes = [];
    }

    addRoute(codePath, apiPath) {
        this.routes.push({ codePath, apiPath });

        const api = require(codePath);
        this.app.use(apiPath, api);
    }
}