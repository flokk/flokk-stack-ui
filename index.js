
/**
 * Module dependencies.
 */
var stack = require("simple-stack-common")
  , router = require("angular-router")
  , join = require("path").join
  , notFound = require("./lib/notFound")
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
  pack.useBefore("logger", express.favicon(theme.favicon));

  // Initialize the pipeline and expose it
  var pipeline = pack.assets = assets.init(config);

  // Let the theme add some paths
  theme.assets(pipeline);

  // Mount the assets
  pack.use("/assets", assets.middleware(pipeline));

  // Expose the index
  pack.use(router({
    index: assets.layout(pipeline)
  }));

  pack.use(notFound());

  pack.use(errorHandler());

  // Return the pack
  return pack;
};

/*
 * Expose express
 */
module.exports.middleware = stack.middleware;
