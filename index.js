
/**
 * Module dependencies.
 */
var stack = require("simple-stack-common")
  , router = require("angular-router")
  , join = require("path").join
  , notFound = require("./lib/notFound")
  , errorHandler = require("./lib/errorHandler")
  , assets = require("simple-assets");

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
  config.theme = config.theme || "theme-retro";
  var theme = require(config.theme);

  // Serve up the theme favicon
  pack.useBefore("logger", stack.middleware.favicon(theme.favicon));

  // Initialize the pipeline and expose it
  var pipeline = pack.assets = assets.init(config, pack);

  if (config.server) {
    ["js", "css", "img", "partials"].forEach(function(dir) {
      pipeline.prependPath(join(process.cwd(), "public", dir));
    });
  }
  else {
    ["js", "css", "img"].forEach(function(dir) {
      pipeline.prependPath(join(process.cwd(), "app", dir));
    });
  }

  // Let the theme add some paths
  theme.assets(pipeline);

  // Mount the assets
  pack.use("/assets", assets.middleware(pipeline));

  // Locals
  pack.locals.APP_NAME = config.appName || require(join(process.cwd(), "package.json")).name

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
