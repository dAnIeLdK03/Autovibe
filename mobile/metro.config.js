const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "..");
const appNodeModules = path.resolve(projectRoot, "node_modules");
const rootNodeModules = path.resolve(monorepoRoot, "node_modules");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [appNodeModules, rootNodeModules];

function resolveReactModule(moduleName) {
  for (const base of [appNodeModules, rootNodeModules]) {
    try {
      return require.resolve(moduleName, { paths: [base] });
    } catch {
      // try next
    }
  }
  return null;
}

const defaultResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === "react" ||
    moduleName === "react/jsx-runtime" ||
    moduleName === "react/jsx-dev-runtime"
  ) {
    const filePath = resolveReactModule(moduleName);
    if (filePath != null) {
      return { type: "sourceFile", filePath };
    }
  }
  if (defaultResolver) {
    return defaultResolver(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
