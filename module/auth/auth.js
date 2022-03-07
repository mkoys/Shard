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

    // Check data type for registration
    const typeResult = register.checkType(data);

    // Check if typeCheck had any errors
    if (typeResult) {
        return next("Invalid request")
    }

    // Checks data by rules
    const checkResult = register.checkData(data);

    // Check if dataCheck had any errors
    if (checkResult.error) {
        return next(checkResult.messages);
    }

    // Check for duplicate user async
    const duplicateResult = await register.duplicate(data);

    // Check if duplicateCheck had any errors
    if (duplicateResult.error) {
        return next(duplicateResult.messages);
    }

    // Create new user from provided data
    const newUser = await register.createUser(data);

    // Save user to database
    register.saveUser(newUser);

    // Return new user
    res.json(newUser);
});

// Export router
module.exports = router;