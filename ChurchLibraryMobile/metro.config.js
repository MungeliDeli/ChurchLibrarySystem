// Metro configuration for Expo
// Enables SVG component imports if 'react-native-svg-transformer' is installed
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

try {
  // Try to enable SVG transformer if available
  const svgTransformerPath = require.resolve("react-native-svg-transformer");
  config.transformer = {
    ...config.transformer,
    babelTransformerPath: svgTransformerPath,
  };
  config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...config.resolver.sourceExts, "svg"],
  };
} catch (error) {
  // Fallback: do nothing if transformer isn't installed
}

module.exports = config;
