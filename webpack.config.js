const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        // Add any packages that need transpiling here
        'react-native-chart-kit',
      ],
    },
  }, argv);
  
  // Customize the config before returning it
  return config;
};
