module.exports = {
    port: 8000, // Port that applicaiton will be using
    databaseUrl: "mongodb://127.0.0.1:27017", // MongoDB connection URL
    databaseName: "guama", // Database name
    auth: { 
        usernameMinLength: 4, // Minumum username lenght
        usernameMaxLength: 20, // Maximum username lenght
        passwordMinLength: 8, // Minimum password length
        passwordCapital: true, // Enable one cappital letter in password
        passwordDigit: true, // Enable one diget in password
        passwordSpecialCharacter: false, // Enable one special character in password
        saltRound: 5, // Password hasing number
    },
    session: {
        tokenLength: 5,
    }
}