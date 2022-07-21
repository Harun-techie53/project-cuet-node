const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const app = express();
const server = require('http').createServer(app);
const authRouter = require('./routes/authRoute');
const courseRouter = require('./routes/courseRoute');
const researchRouter = require('./routes/researchRoute');
const registeredTermRouter = require('./routes/registeredTermRoute');
const registerSocketServer = require('./socketServer');
const path = require('path');

//configure socket server
registerSocketServer(server);

app.use(express.json());
app.use(cors());

// Routes defined
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/research', researchRouter);
app.use('/api/v1/registered-term', registeredTermRouter);

// Database connection
connectDB();

//----------------Deployment-------------------

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running');
    });
}

//----------------Deployment-------------------

const {PORT} = process.env;

//Initialize a serverInstance
    server.listen(PORT, () => {
        console.log(`App is running on port ${PORT}...`);
    });