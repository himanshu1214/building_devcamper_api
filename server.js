const express = require('express');
const dotenv = require('dotenv');

//Route files
const bootcamps = require('./routes/bootcamps')

//Load env vars
dotenv.config({ path: './config/config.env'});

//Mount routes
const app = express();
app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000;



app.listen(PORT, console.log(`Server hosted under NODE env : ${process.env.NODE_ENV} on node:  ${PORT}`));