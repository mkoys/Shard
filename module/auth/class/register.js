module.exports = class Register {
    constructor() {}

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
}