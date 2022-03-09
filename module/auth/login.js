const bcrypt = require("bcrypt");

const connection = require("../../connection.js");

const { session } = require("../../class/controller.js");

module.exports = class Login {
    constructor() {
        this.users = connection.get().collection("users");
    }

    checkType(data) {
        // Check if any data
        if (!data || typeof data !== "object") {
            return 1;
        }

        // Check if data aren't empty
        if (Object.keys(data).length == 0) {
            return 1;
        }

        // Check if all input's are in data
        if (!data.email && !data.username) {
            return 1;
        }

        // Check if all input's are in data
        if (!data.password) {
            return 1;
        }

        // If email is provided
        if (data.email) {
            // Check types of data if not right throw error
            if (typeof data.email !== "string") {
                return 1;
            }
        }

        // If username is provided
        if (data.username) {
            // Check types of data if not right throw error
            if (typeof data.username !== "string") {
                return 1;
            }
        }

        // If we have provided both email and username error
        if (data.email && data.username) {
            return 1;
        }

        // Check types of data if not right throw error
        if (typeof data.password !== "string") {
            return 1;
        }

        // No error return 0
        return 0;
    }

    // Find user in database and compare password hash
    compare(data, user) {
        // Copare password hash to password string
        const passwordCompare = bcrypt.compareSync(data.password, user.password);

        // If compare failed error
        if (!passwordCompare) {
            return 1;
        }

        // No error return 0
        return 0;
    }

    async findUser(data) {
        // Variable to store found user
        let foundUser;

        // Check what data user entered email or username
        if (data.username) {
            foundUser = await this.users.findOne({ username: data.username.toLowerCase() }); // Find user in database by username
        } else {
            foundUser = await this.users.findOne({ email: data.email.toLowerCase() }); // Find user in database by email
        }

        // If we have found no user error
        if (!foundUser) {
            return 0;
        }

        // Return found users data
        return foundUser;
    }

    async user(data, respond, error) {
        // Check data type for registration
        const typeResult = this.checkType(data);

        // Check if typeCheck had any errors
        if (typeResult) {
            return error("Invalid request");
        }

        // Find user from data
        const user = await this.findUser(data);

        // If no user found error
        if(!user) {
            return error("Invalid credentials");
        }

        // Login set user
        const compareResult = await this.compare(data, user);

        // Check if compareCheck had any errors
        if (compareResult) {
            return error("Invalid credentials");
        }

        // Create user and save his token
        const token = session.create(user);

        // Respond with token and return 0
        respond.json({token});
        return 0;
    }
}