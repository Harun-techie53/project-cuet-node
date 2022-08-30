const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });
const connectDB = require('./config/db');
const app = express();
const server = require('http').createServer(app);
const authRouter = require('./routes/authRoute');
const courseRouter = require('./routes/courseRoute');
const researchRouter = require('./routes/researchRoute');
const registeredTermRouter = require('./routes/registeredTermRoute');
const registerSocketServer = require('./socketServer');
const path = require('path');
var upload = multer();
app.use( express.static( path.join( __dirname, 'public' ) ) );

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

//configure socket server

registerSocketServer(server);
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions));

// Routes defined
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/research', researchRouter);
app.use('/api/v1/registered-term', registeredTermRouter);

// Database connection
connectDB();

const PORT = process.env.PORT || 8080;

//Initialize a serverInstance
server.listen(PORT, () => {
    console.log(`App is running on port ${PORT}...`);
});