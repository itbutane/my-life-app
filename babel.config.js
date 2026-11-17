module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@': './',
            '@/components': './components',
            '@/hooks': './hooks',
            '@/constants': './constants',
            '@/types': './types',
            '@/assets': './assets',
          },
        },
      ],
    ],
  };
};