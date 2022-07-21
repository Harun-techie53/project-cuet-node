const mongoose = require('mongoose');

const DB = process.env.DATABASE_STRING.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const connectDB = () => mongoose.connect(DB, {
    useNewUrlParser: true
}).then((con) => {
    console.log('Database connected!');
});

module.exports = connectDB;