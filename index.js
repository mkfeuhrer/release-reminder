// Lets Rock and Roll
const createScheduler = require('probot-scheduler')
const getConfig = require('probot-config')
const moment = require('moment')

const getDate = require('./src/getDate')
const getComment = require('./src/getComment')
const defaultConfig = require('./src/defaultConfig')
const getNumDayFromLongDay = require('./src/getNumDayFromLongDay')
const fixConfig = require('./src/fixConfig')
const { findReleases, generateReleaseBody } = require('./src/getReleases')
const getAllPullRequests = require('./src/getAllPullRequests')

// 24 hours
const interval = 24 * 60 * 60 * 1000
const events = ['pull_request','push','release']
const configName = 'release-reminder.yml'

module.exports = app => {

  app.log('Yay, Release Reminder app was loaded successfully!')

  // createScheduler(app, {interval: interval})
  app.on(events, async context => {
    app.log('App is running as per ' + context.event)
    app.log('Local Time: ' + moment().format())
    app.log(context)

    const { owner, repo } = context.repo()
    app.log(`Repository: ${owner}/${repo}`)

    const headDate = getDate.headDate()
    const tailDate = getDate.tailDate()

    let config = await getConfig(context, configName)

    const pullRequests = await getAllPullRequests(context, {owner, repo})
    app.log(pullRequests);

    // config = fixConfig(config)
    // console.log(`Publish Day: ${getNumDayFromLongDay(config.publishDay)}, Today: ${moment.utc().day()}`)
    // if (moment.utc().day() === getNumDayFromLongDay(config.publishDay)) {
    //   await weeklyDigest(context, {owner, repo, headDate, tailDate}, config)
    // }

  })
}
