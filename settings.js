module.exports = {
    port: 8000, // Port that applicaiton will be using
    auth: {
        usernameMinLength: 4,
        usernameMaxLength: 20,
        passwordMinLength: 8,
        passwordCapital: true,
        passwordDigit: true,
        passwordSpecialCharacter: false
    }
}