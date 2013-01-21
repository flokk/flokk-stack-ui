
module.exports = function () {
  return function notFound(req, res, next) {
    var err = new Error("'"+req.url+"' could not be found");
    err.code = 404;
    err.defaultMessage = "Not Found";
    next(err);
  };
};