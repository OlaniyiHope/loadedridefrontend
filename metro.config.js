// /**
//  * Metro configuration for React Native
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// module.exports = {
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: true,
//       },
//     }),
//   },
// };
const { getDefaultConfig } = require('metro-config');
const path = require('path');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();

  return {
    ...defaultConfig,
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    // ⚠️ Exclude node_modules from being watched unnecessarily
    watchFolders: [
      path.resolve(__dirname),
    ],
    resolver: {
      ...defaultConfig.resolver,
    },
    server: {
      enhanceMiddleware: (middleware) => middleware,
    },
    // ⚠️ Hard limits to avoid file watcher crash
    maxWorkers: 2,
    resetCache: true,
  };
})();
