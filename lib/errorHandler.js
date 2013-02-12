
module.exports = function () {
  return function errorHandler(err, req, res, next) {
    err.code = err.code || 500;
    if(err.code > 499) console.error(err.stack || err);
    var message = process.env.NODE_ENV==="development"? err.stack : err;
    res.type("text/plain");
    res.send(err.code, message);
  };
};