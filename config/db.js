const mongoose = require('mongoose');

const connectDb = async() => {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGO_URI
    );
    
console.log(`MongoDb connection : ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDb;