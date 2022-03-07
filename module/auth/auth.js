// Import NPM modules
const express = require("express");

// Import classes
const Register = require("./register.js");
const Login = require("./login.js");

// Express router
const router = express.Router();

// Create classes
const register = new Register();
const login = new Login();

// Register
router.post("/register", async (req, res, next) => {
    // Get data from request
    const data = req.body;

    // Registers new user
    register.user(data, res, next);
});

// Login
router.post("/login", async (req, res, next) => {
    // Get data from request
    const data = req.body;

    // Login user
    login.user(data, res, next);
});

// Export router
module.exports = router;