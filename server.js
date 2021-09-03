const express = require('express');
const http = require('http');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const fileUpload = require('express-fileupload');
const helmet = require('helmet')

const app = express();
app.use(helmet())

// db setup
mongoose.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// app setup
app.use(morgan('dev'));

const corsOptions = {
    'allowedHeaders': ['Content-Type'],
    'exposedHeaders': ['Content-Type'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

const authRoutes = require('./routes/auth.routes')
app.use('/', authRoutes)

const userRoutes = require('./routes/user.routes')
app.use('/users', userRoutes)

const fileRoutes = require('./routes/file.routes')
app.use('/files', fileRoutes)

const settingsRoutes = require('./routes/settings.routes')
app.use('/settings', settingsRoutes)

const resumeRoutes = require('./routes/resume.routes')
app.use('/resume', resumeRoutes)

const appsRoutes = require('./routes/apps.routes')
app.use('/apps', appsRoutes)

const server = http.createServer(app);
server.listen(5000);