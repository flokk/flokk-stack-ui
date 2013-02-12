
/**
 * Module dependencies.
 */
var stack = require("simple-stack-common")
  , router = require("angular-router")
  , join = require("path").join
  , notFound = require("./lib/notFound")
  , errorHandler = require("./lib/errorHandler");

// Add this for theme lookup
module.paths.push(join(process.cwd(), "node_modules"));

/**
 * Expose the stack
 */
module.exports = function(config) {
  if (!config) config = {};

  // Create a pack
  var pack = stack(config);

  // Locals
  pack.locals.APP_NAME = config.appName || require(join(process.cwd(), "package.json")).name

  pack.use(function localBase(req, res, next) {
    res.locals.base = req.base;
    next();
  });

  // Router
  if (config.server) {
    pack.use(pack.router);
  }
  else {
    pack.use(router({
      index: function(req, res) {
        res.render(theme.layout, {
          ANGULAR: true
        });
      }
    }));
  }

  pack.use(notFound());

  pack.use(errorHandler());

  // Return the pack
  return pack;
};

/*
 * Expose express
 */
module.exports.middleware = stack.middleware;
