
module.exports = function () {
  return function errorHandler(err, req, res, next) {
    res.send("Error!");
  };
};