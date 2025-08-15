const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
        assetExts: [
            'bin', 'txt', 'jpg', 'png', 'json', 'gif',
            'webp', 'bmp', 'psd', 'svg', 'pdf', 'zip',
            'mp4', 'mov', 'avi', 'wmv', 'flv', 'webm',
            'mp3', 'wav', 'aac', 'ogg', 'wma',
            'onnx', 'ttf',
            'tflite', 'pb', 'pth', 'pkl', 'h5'
        ],
    },
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
