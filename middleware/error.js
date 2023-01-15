const ErrorResponse = require("../utils/errorResponse");

//Adding a custom error hander for the controller methods 
const errorHandler = (err, req, res, next) => {
let error = { ...err };
error.message = err.message;


// Log to console
console.log(err.stack.red);

// Mongoose bad Object Id
if (err.name == 'CastError') {
    const message = `Bootcamp not found with the id : ${err.value} `;
    error = new ErrorResponse(message, 404);
}
res.status(500).json({
    success: false, 
    error : error.message
});
};

module.exports = errorHandler;