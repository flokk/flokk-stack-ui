
module.exports = function () {
  return function errorHandler(err, req, res, next) {
    console.error(err);
    var message = process.env.NODE_ENV==="development"? err.stack : err;
    res.send(err.status || 500, message);
  };
};