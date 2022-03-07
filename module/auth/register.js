const settings = require("../../settings.js");

const bcrypt = require("bcrypt");

const connection = require("../../connection.js");

module.exports = class Register {
    constructor() {
        this.users = connection.get().collection("users");
        this.rules = {
            usernameMinLength: settings.auth.usernameMinLength || 2,
            usernameMaxLength: settings.auth.usernameMaxLength || 10,
            emailTest: new RegExp(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/),
            passwordMinLength: settings.auth.passwordMinLength || 10,
            passwordCapitalTest: new RegExp(/^(?=.*[A-Z]).*$/),
            passwordSpecialTest: new RegExp(/^(?=.*\W).*$/),
            passwordDigitTest: new RegExp(/^(?=.*\d).*$/),
        }
    }

    // Checks type of input
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
        if (!data.username || !data.email || !data.password) {
            return 1;
        }

        // Check types of data if not right throw error
        if (typeof data.password !== "string" || typeof data.email !== "string" || typeof data.username !== "string") {
            return 1;
        }

        return 0;
    }

    // Check input data by rules
    checkData(data) {
        // Result variable
        let result = {
            error: false,
            messages: []
        }

        // Check minimum username lenght
        if (data.username.length < this.rules.usernameMinLength) {
            result.error = true;
            result.messages.push("Username too short");
        }

        // Check maximum username lenght
        if (data.username.length > this.rules.usernameMaxLength) {
            result.error = true;
            result.messages.push("Username too long");
        }

        // Check if email is valid
        if (!this.rules.emailTest.test(data.email)) {
            result.error = true;
            result.messages.push("Email is not valid");
        }

        // Check minimum password lenght
        if (data.password.length < this.rules.passwordMinLength) {
            result.error = true;
            result.messages.push("Password too short");
        }

        // Check if password has a capital letter
        if (!this.rules.passwordCapitalTest.test(data.password) && settings.auth.passwordCapital) {
            result.error = true;
            result.messages.push("Password must have at least one capital letter");
        }

        // Check if password contains diget
        if (!this.rules.passwordDigitTest.test(data.password) && settings.auth.passwordDigit) {
            result.error = true;
            result.messages.push("Password must contain at least one number");
        }

        // Chceck if password has special character
        if (!this.rules.passwordSpecialTest.test(data.password) && settings.auth.passwordSpecialCharacter) {
            result.error = true;
            result.messages.push("Password must contain at least one special character");
        }

        // Return result
        return result;
    }

    async duplicate(data) {
        // Result variable
        let result = {
            error: false,
            messages: []
        }

        // Check for duplicate users eather by username of by email
        const duplicateUser = await this.users.findOne({
            $or: [
                { username: data.username.toLowerCase() },
                { email: data.email.toLowerCase() }
            ]
        });

        // If we have dplicate user throw error
        if (duplicateUser) {
            if (
                duplicateUser.username === data.username.toLowerCase() &&
                duplicateUser.email === data.email.toLowerCase()
            ) {
                result.error = true;
                result.messages.push("Username and Email already in use");
            } else if (duplicateUser.username === data.username.toLowerCase()) {
                result.error = true;
                result.messages.push("Username already in use");
            } else {
                result.error = true;
                result.messages.push("Email already in use");
            }
        }

        // Return result
        return result;
    }

    // Creates user from data
    async createUser(data) {
        // Get id from all users in database plus one
        const id = (await this.users.count()) + 1;

        // Deconstruct data
        const { username, email, password } = data;

        // Hash password
        const secret = bcrypt.hashSync(password, settings.auth.saltRound);

        // Create new user from data
        const user = {
            id: id,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: secret
        }

        return user;
    }

    saveUser(user) {
        this.users.insertOne(user);
    }
}