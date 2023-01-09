const express = require('express');
const dotenv = require('dotenv');


//Load env vars
dotenv.config({ path: './config/config.env'});

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server hosted under NODE env : ${process.env.NODE_ENV} on node:  ${PORT}`));