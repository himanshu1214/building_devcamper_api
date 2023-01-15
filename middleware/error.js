const ErrorResponse = require("../utils/errorResponse");

//Adding a custom error hander for the controller methods 
const errorHandler = (err, req, res, next) => {
let error = { ...err };
error.message = err.message;

//console log
console.log(err)

// Mongoose bad Object Id
if (err.name == 'CastError') {
    const message = `Bootcamp not found with the id : ${error.value} `;
    error = new ErrorResponse(message, 404);
}

// Duplication Erro
if (err.code == 11000) {
    const message = 'Bootcamp entered with duplicate values';
    error = new ErrorResponse(message, 400);
}

// Missing input failures while creating bootcamps
if (err.name == 'ValidationError') {
    const message = Object.values(err.errors).map( val => val.message );
    error = new ErrorResponse(message, 400);
}

res.status(error.statusCode || 500).json({
    success: false, 
    error : error.message || 'Server Error'
});
};

module.exports = errorHandler;