// Lets Rock and Roll
const createScheduler = require('@bcgov/probot-scheduler')
<<<<<<< HEAD
=======
const getConfig = require('probot-config')
>>>>>>> 185aa9940398837dc02619128d4acf204c649875
const moment = require('moment')
const compareVersions = require('compare-versions')

const getDate = require('./src/getDate')
const getClosedPullRequests = require('./src/getClosedPullRequests')
const getOpenPullRequests = require('./src/getOpenPullRequests')
<<<<<<< HEAD
const callOpenPullRequests = require('./src/callOpenPullRequest')
const callClosedPullRequests = require('./src/callClosedPullRequests')
=======
const getLabels = require('./src/getLabels')
>>>>>>> 185aa9940398837dc02619128d4acf204c649875
const getReleases = require('./src/getReleases')
const getDefaultConfig = require('./src/defaultConfig')
const fixConfig = require('./src/fixConfig')

// 24 hours
<<<<<<< HEAD
const interval = 1 * 60 * 1000
const events = ['pull_request']
=======
const interval = 2 * 60 * 1000
const events = ['pull_request','push','comments','issues']
>>>>>>> 185aa9940398837dc02619128d4acf204c649875
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
<<<<<<< HEAD

    if(!config.latestRelease || !config.releaseInterval){
      app.log('No valid config found , see Readme for instructions regarding config')
      return
    }

    let releases = await getReleases(context, {owner, repo})
    app.log(releases)

=======

    if(!config.latestRelease || !config.releaseInterval){
      app.log('No valid config found , see Readme for instructions regarding config')
      return
    }

    let releases = await getReleases(context, {owner, repo})
    app.log(releases)

>>>>>>> 185aa9940398837dc02619128d4acf204c649875
    releases = releases
    .filter(r => !r.draft)
    .sort((r1, r2) => compareVersions(r2.tag_name, r1.tag_name))

    if (releases.length === 0) {
      app.log('No new releases found')
      return
<<<<<<< HEAD
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
=======
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
  createScheduler(app, {interval: interval})
  app.on(events, async context => {
    app.log('App is running as per ' + context.event)
    app.log('Local Time: ' + moment().format())

    const { owner, repo } = context.repo()
    app.log(`Repository: ${owner}/${repo}`)

    const config = getDefaultConfig
    const closedPullRequests = await getClosedPullRequests(context, {owner, repo})
    const openPullRequests = await getOpenPullRequests(context, {owner, repo})
    const result = [];
    
    // Only update open pull request with labels and comments
    for( var i = 0;i < openPullRequests.length;i++) {
      // use github.issues.createComment endpoint for commenting on a PR
      // https://octokit.github.io/rest.js/#api-Issues-createComment
      const pr = openPullRequests[i]
      const remainingDays = getDate.getDayBeforeDate(config.creationTime)
      // const params = context.issue({number: pr['number'], body: 'Reminder : Next Release Date is in x days , Please merge the PR before that!' })
      // result.push(context.github.issues.createComment(params));
      
      // Fetch labels for this PR
      const number = pr.number
      const listLabels = await getLabels(context, {owner, repo, number})
      const labelsToAdd = [":exclamation: release-reminder"]

      app.log(listLabels)
      
      // Check if any label exists
      if(listLabels.length == 0){
        result.push(context.github.issues.addLabels(context.issue({labels: labelsToAdd})))
      }

      // Add Labels if not added till now
      for( var i = 0;i < listLabels.length;i++) {
        for( var j = 0;j < labelsToAdd.length;j++){
          if(listLabels[i].name != labelsToAdd[j])
            result.push(context.github.issues.addLabels(context.issue({labels: labelsToAdd})))
        }
      }
    }

    // Working with closed pull request
    for(var i = 0;i < closedPullRequests.length;i++){      
      const pr = closedPullRequests[i]
      // Fetch labels for this PR
      const number = pr.number
      const listLabels = await getLabels(context, {owner, repo, number})
      // Remove Label if added till now      
      for( var i = 0;i < listLabels.length;i++) {
        labelsToAdd = [":exclamation: release-reminder"]
        for( var j = 0;j < labelsToAdd.length;j++){
          if(listLabels[i].name == labelsToAdd[j])
            result.push(context.github.issues.removeLabel(context.issue({ number: number,name: labelsToAdd[j]})))
        }
      }
>>>>>>> 185aa9940398837dc02619128d4acf204c649875
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
