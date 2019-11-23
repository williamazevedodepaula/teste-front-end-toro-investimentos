// Karma configuration
// Generated on Sat Nov 23 2019 15:11:41 GMT-0300 (GMT-03:00)

module.exports = function(config) {
  config.set({
  basePath: '',
  frameworks: ['mocha', 'chai'],
  files: [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/angular/angular.min.js',
    './node_modules/angular-ui-router/release/angular-ui-router.min.js',
    './node_modules/angular-mocks/angular-mocks.js',
    './node_modules/sinon/pkg/sinon.js',
    './src/module/app.js',
    './src/services/**',
    './test/**',
  ],
  exclude: [],
  preprocessors: {},
  reporters: ['progress'],
  port: 9876,
  colors: true,
  logLevel: config.LOG_INFO,
  autoWatch: true,
  browsers: ['Chrome'],
  singleRun: false,
  concurrency: Infinity
  })
  }