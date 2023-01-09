const express = require('express');
const dotenv = require('dotenv');


//Load env vars
dotenv.config({ path: './config/config.env'});

const app = express();

app.get('/api/v1/bootcamps', (req, res) => {
res.status(200).json({success: true, msg : 'Show all bootcamps'})
})


app.post('/api/v1/bootcamps/:id', (req, res) => {
res.status(200).json({success: true, msg: `Added one bootcamp : ${req.params.id}`})
})


app.put('/api/v1/bootcamps/:id', (req, res) => {
res.status(200).json({success: true, msg: `Updated one bootcamp : ${req.params.id}`})
})


app.delete('/api/v1/bootcamps/:id', (req, res) => {
res.status(200).json({success: true, msg: `Deleted one bootcamp : ${req.params.id}`})
})
const PORT = process.env.PORT || 5000;



app.listen(PORT, console.log(`Server hosted under NODE env : ${process.env.NODE_ENV} on node:  ${PORT}`));