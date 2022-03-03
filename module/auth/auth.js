// Import NPM modules
const express = require("express");

// Import classes
const Register = require("./class/register.js");

// Express router
const router = express.Router();

// Register
router.post("/register", (req, res) => {
    // Create register class
    const register = new Register();

    // Get data from request
    const data = req.body;

    // Check data type for registration
    register.checkType(data);

    // Checks data by rules
    register.checkData(data);

    const newUser = register.createUser(data);

    res.json(newUser);
});

// Export router
module.exports = router;