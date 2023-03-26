const HttpError = require('./models/http-error');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const mongoose = require('mongoose');
// const connectDB =require ("./db.js");

require('dotenv').config();
// connectDB();
const express = require('express');

const app = express();
app.use(express.json());

app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users', usersRoutes); // => /api/places...

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.',404)
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });


