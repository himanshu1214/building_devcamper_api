const express = require('express');
const dotenv = require('dotenv');
const morgan =  require('morgan');
const colors = require('colors');
const connectDb = require('./config/db');


//Load env vars
dotenv.config({ path: './config/config.env'});

//Route files
const bootcamps = require('./routes/bootcamps');

connectDb();

//Mount routes
const app = express();

if (process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;


const server = app.listen(PORT, console.log(`Server hosted under NODE env : ${process.env.NODE_ENV} on node:  ${PORT}`.yellow)
);

//Handle unhandled rejections

process.on('unhandledRejection',(err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
})

