const fs = require("fs");
const mongoose = require("mongoose");
const colors = require('colors');
const dotenv = require('dotenv');
var encoder = new TextEncoder();   

// add config4
dotenv.config({ path: './config/config.env' });

// load models
const Bootcamp = require('./models/Bootcamp');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useFindAndModify: false, 
    useUnifiedTopology: true
});

//  Add data to DB
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
  );

console.log(`data found : {bootcamps}`)
const importData = async() => {
try {
    await Bootcamp.create(bootcamps);
    console.log('Create data in Db'.green.inverse);
    process.exit();
} catch (err) {
    console.error(err);
}
};

// Delete data
const deleteData = async() => {
    try {
        await Bootcamp.deleteMany(bootcamps);
        console.log('Delete data in Db'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
    };



if (process.argv[2] === '-i'){
    importData();
}
else if (process.argv[2] === '-d'){
    deleteData();
}