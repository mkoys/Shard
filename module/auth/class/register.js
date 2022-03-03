const settings = require("../../../settings.js");

const bcrypt = require("bcrypt");

module.exports = class Register {
    constructor() {
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
            throw new Error("400: Invalid input");
        }

        // Check if data aren't empty
        if (Object.keys(data).length == 0) {
            throw new Error("400: Invalid input");
        }

        // Check if all input's are in data
        if(!data.username || !data.email || !data.password) {
            throw new Error("400: Missing input");
        }

        // Check types of data if not right throw error
        if(typeof data.password !== "string" || typeof data.email !== "string" || typeof data.username !== "string") {
            throw new Error("400: Invalid input type");
        }
    }

    // Check input data by rules
    checkData(data) {
        // Result variable
        let result = {
            error: false,
            messages: []
        }

        // Check minimum username lenght
        if(data.username.length < this.rules.usernameMinLength) {
            result.error = true;
            result.messages.push("Username too short");
        }

        // Check maximum username lenght
        if(data.username.length > this.rules.usernameMaxLength) {
            result.error = true;
            result.messages.push("Username too long");
        }

        // Check if email is valid
        if(!this.rules.emailTest.test(data.email)) {
            result.error = true;
            result.messages.push("Email is not valid");
        }

        // Check minimum password lenght
        if(data.password.length < this.rules.passwordMinLength) {
            result.error = true;
            result.messages.push("Password too short");
        }

        // Check if password has a capital letter
        if(!this.rules.passwordCapitalTest.test(data.password) && settings.auth.passwordCapital) {
            result.error = true;
            result.messages.push("Password must have at least one capital letter");
        }

        // Check if password contains diget
        if(!this.rules.passwordDigitTest.test(data.password) && settings.auth.passwordDigit) {
            result.error = true;
            result.messages.push("Password must contain at least one number");
        }

        // Chceck if password has special character
        if(!this.rules.passwordSpecialTest.test(data.password) && settings.auth.passwordSpecialCharacter) {
            result.error = true;
            result.messages.push("Password must contain at least one special character");
        }

        // If we have found error throw error
        if(result.error) {
            throw new Error(`400: ${result.messages}`)
        }
    }

    // Creates user from data
    createUser(data) {
        // Deconstruct data
        const {username, email, password} = data;

        // Hash password
        const secret = bcrypt.hashSync(password, settings.auth.saltRound);

        // Create new user from data
        const user = {
            username,
            email,
            password: secret
        }

        return user;
    }
}