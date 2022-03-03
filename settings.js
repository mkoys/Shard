module.exports = {
    port: 8000, // Port that applicaiton will be using
    databaseUrl: "mongodb://127.0.0.1:27017",
    auth: {
        usernameMinLength: 4,
        usernameMaxLength: 20,
        passwordMinLength: 8,
        passwordCapital: true,
        passwordDigit: true,
        passwordSpecialCharacter: false,
        saltRound: 5,
    }
}