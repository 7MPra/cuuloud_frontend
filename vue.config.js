module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  publicPath: '/',
  outputDir: '../dist/',
  assetsDir: 'static',
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Cuuloud',
    },
  },
};
