// Karma configuration
// Generated on Sat Nov 23 2019 15:11:41 GMT-0300 (GMT-03:00)

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/angular/angular.min.js',
      "./node_modules/angular-animate/angular-animate.min.js",
      "./node_modules/angular-aria/angular-aria.min.js",
      "./node_modules/angular-messages/angular-messages.min.js",
      './node_modules/angular-ui-router/release/angular-ui-router.min.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './node_modules/angular-material/angular-material.min.js',
      './node_modules/sinon/pkg/sinon.js',
      './node_modules/moment/min/moment.min.js',
      './src/module/app.js',
      './src/services/**',
      './src/components/**',
      './test/**',
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
}