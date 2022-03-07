// Import NPM modules
const express = require("express");

// Import classes
const Register = require("./register.js");

// Express router
const router = express.Router();

// Create register class
const register = new Register();

// Register
router.post("/register", async (req, res, next) => {
    // Get data from request
    const data = req.body;

    // Registers new user
    register.user(data, res, next);
});

// Export router
module.exports = router;