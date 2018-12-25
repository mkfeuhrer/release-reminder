// Lets Rock and Roll
const createScheduler = require('@bcgov/probot-scheduler')
const moment = require('moment')
const compareVersions = require('compare-versions')

const getDate = require('./src/getDate')
const getClosedPullRequests = require('./src/getClosedPullRequests')
const getOpenPullRequests = require('./src/getOpenPullRequests')
const callOpenPullRequests = require('./src/callOpenPullRequest')
const callClosedPullRequests = require('./src/callClosedPullRequests')
const getReleases = require('./src/getReleases')
const getDefaultConfig = require('./src/defaultConfig')
const fixConfig = require('./src/fixConfig')

// 24 hours
const interval = 1 * 60 * 1000
const events = ['pull_request']
const event_release = ['release']

const versionNumber = (version) => {
  return version.replace(/^v/, '')
}

module.exports = app => {

  app.log('Yay, Release Reminder app was loaded successfully!')

  // Release event
  app.on(event_release, async context => {

    app.log('App is running as per ' + context.event)
    app.log('Local Time: ' + moment().format())

    const { owner, repo } = context.repo()
    app.log(`Repository: ${owner}/${repo}`)

    const config = getDefaultConfig

    if(!config.latestRelease || !config.releaseInterval){
      app.log('No valid config found , see Readme for instructions regarding config')
      return
    }

    let releases = await getReleases(context, {owner, repo})
    app.log(releases)

    releases = releases
    .filter(r => !r.draft)
    .sort((r1, r2) => compareVersions(r2.tag_name, r1.tag_name))

    if (releases.length === 0) {
      app.log('No new releases found')
      return
    }

    const latest = releases.filter(r => !r.prerelease)[0]
    const latestPre = releases.filter(r => r.prerelease)[0]

    app.log("Latest release for now -> ")
    app.log(latest.tag_name + "created at" + latest.created_at)

    if (latest) {
      config.latestRelease = versionNumber(latest.tag_name)
      config.latestReleaseNumber = latest.tag_name
      config.creationTime = latest.created_at
      app.log('Latest Release found ! Configuration Updated')
    }
    fixConfig(config)
  })

  // Update PR's with comments and labels
  // createScheduler(app, {interval: interval})
  app.on(events, async context => {
    app.log('App is running as per ' + context.event)
    app.log('Local Time: ' + moment().format())

    const { owner, repo } = context.repo()
    app.log(`Repository: ${owner}/${repo}`)

    const config = getDefaultConfig
    const closedPullRequests = await getClosedPullRequests(context, {owner, repo})
    const openPullRequests = await getOpenPullRequests(context, {owner, repo})
    const result = [];
    
    const open = await callOpenPullRequests(context, {owner, repo, openPullRequests, result})
    const closed = await callClosedPullRequests(context, {owner, repo, closedPullRequests, result})
    return result
  })
}
