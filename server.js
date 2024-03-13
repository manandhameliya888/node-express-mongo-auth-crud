const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 5000;

// app.use are middlewares and this is default middleware for parsing the body coming from request
app.use(express.json())

// app.use are middlewares and this middleware is for routing contacts api
app.use("/api/contacts", require('./routes/contactRoutes'));

// app.use are middlewares and this middleware is for routing users api
app.use("/api/users", require('./routes/userRoutes'));

// This custom middleware is for handling the errors
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
})