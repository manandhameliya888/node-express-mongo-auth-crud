const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log("Database Connected: ", connect.connection.host, connect.connection.name);
    } catch (error) {
        console.log("Error in Database Connection! ==>", error);
        process.exit(1)
        // throw error
    }
}

module.exports = connectDb;