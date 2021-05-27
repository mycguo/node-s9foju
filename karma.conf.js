// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-mocha-reporter'),
      require('karma-junit-reporter'),
      require('karma-jasmine-order-reporter')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser,
      jasmine: {
        timeoutInterval: 30000,
        //seed: '28937' // This must be a string or the karma-jasmine-html-reporter will error https://github.com/dfederm/karma-jasmine-html-reporter/issues/19
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'cobertura', 'json-summary'],
      fixWebpackSourcePaths: true
    },
    junitReporter: {
      outputDir: 'junit'
    },
    // remove the jasmine-order reporter due to an error when running tests in Webstorm
    reporters: ['kjhtml', 'mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome', 'ChromeHeadless'],
    singleRun: true,
    captureTimeout: 210000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 210000,
    browserDisconnectTimeout: 210000
  });
};
