// Import NPM modules
const express = require("express");

// Import classes
const Register = require("./register.js");

// Express router
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    // Create register class
    const register = new Register();

    // Get data from request
    const data = req.body;

    // Check data type for registration
    register.checkType(data);

    // Checks data by rules
    register.checkData(data);

    // Check for duplicate user async
    await register.duplicate(data);

    // Create new user from provided data
    const newUser = register.createUser(data);

    // Return new user
    res.json(newUser);
});

// Export router
module.exports = router;