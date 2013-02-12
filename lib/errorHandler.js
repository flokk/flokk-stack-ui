
module.exports = function () {
  return function errorHandler(err, req, res, next) {
    console.error(err);
    res.send(err.stack || err);
  };
};