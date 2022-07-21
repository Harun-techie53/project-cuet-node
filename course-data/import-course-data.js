require('dotenv').config({ path: '../.env' });
const Course = require('../models/courseModel');
const fs = require('fs');
const connectDB = require('../config/db');

//Database connection
connectDB();

//Read the data from file system
const courses = JSON.parse(fs.readFileSync(`${__dirname}/course-data.json`, 'utf-8'));

const importData = async () => {
    try {
        await Course.create(courses);
        console.log('Data is successfully imported!');
        process.exit();
    } catch (err) {
        console.log(err.message);
    }
}


if(process.argv[2] === '--import') importData();