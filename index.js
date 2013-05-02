
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

  // Require our theme
  config.theme = config.theme || "theme-origami";
  var theme = require(config.theme);

  // Serve up the theme favicon
  pack.useBefore("logger", stack.middleware.favicon(theme.favicon));

  // Serve our built assets
  pack.useAfter("logger", stack.middleware.static(join(process.cwd(), "build")));

  // Parse cookies
  pack.useAfter("static", stack.middleware.cookieParser());

  // Locals
  pack.locals.APP_NAME = config.appName || require(join(process.cwd(), "package.json")).name

  pack.useBefore("router", function localBase(req, res, next) {
    res.locals.base = req.base;
    next();
  });

  // Router
  if (!config.server) {
    pack.replace("router", router({
      index: function(req, res) {
        // TODO
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
