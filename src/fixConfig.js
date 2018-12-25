const defaultConfig = require('./defaultConfig')
const moment = require('moment')

module.exports = (config) => {
  if (config === null) {
    config = defaultConfig
  } else {
    if (!config.hasOwnProperty('releaseInterval')) {
      config.releaseInterval = 28
    }
    if (!config.hasOwnProperty('latestRelease')) {
      config.latestRelease = "v1.0"
    }
    if (!config.hasOwnProperty('latestReleaseNumber')) {
      config.latestReleaseNumber = 1.0
    }
    if (!config.hasOwnProperty('creationTime')) {
      config.creationTime = moment();
    }
  }

  return config
}
