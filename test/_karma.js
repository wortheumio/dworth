module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    files: [
      '_browser.js'
    ],
    preprocessors: {
      '_browser.js': [ 'browserify' ]
    },
    browserNoActivityTimeout: 1000 * 60 * 5,
    browserify: {
      debug: true,
      plugin: [ ['tsify', {project: 'test/tsconfig.json'} ] ]
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
  })
}
