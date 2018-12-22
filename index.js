// Lets Rock and Roll
const createScheduler = require('probot-scheduler')
const getConfig = require('probot-config')
const moment = require('moment')

const getDate = require('./src/getDate')
const defaultConfig = require('./src/defaultConfig')
const getNumDayFromLongDay = require('./src/getNumDayFromLongDay')
const { findReleases, generateReleaseBody } = require('./src/getReleases')
const getClosedPullRequests = require('./src/getClosedPullRequests')
const getOpenPullRequests = require('./src/getOpenPullRequests')
const getLabels = require('./src/getLabels')

// 24 hours
const interval = 24 * 60 * 60 * 1000
const events = ['pull_request','push','comments','issues']
const configName = 'release-reminder.yml'

module.exports = app => {

  app.log('Yay, Release Reminder app was loaded successfully!')

  // createScheduler(app, {interval: interval})
  app.on(events, async context => {
    app.log('App is running as per ' + context.event)
    app.log('Local Time: ' + moment().format())

    const { owner, repo } = context.repo()
    app.log(`Repository: ${owner}/${repo}`)

    const headDate = getDate.headDate()
    const tailDate = getDate.tailDate()

    let config = await getConfig(context, configName)
    result = [];
    const closedPullRequests = await getClosedPullRequests(context, {owner, repo})
    const openPullRequests = await getOpenPullRequests(context, {owner, repo})
    
    for( var i = 0;i < openPullRequests.length;i++) {
      // use github.issues.createComment endpoint for commenting on a PR
      // https://octokit.github.io/rest.js/#api-Issues-createComment
      const pr = openPullRequests[i]
      // const params = context.issue({number: pr['number'], body: 'Reminder : Next Release Date is in x days , Please merge the PR before that!' })
      // result.push(context.github.issues.createComment(params));
      
      // Fetch labels for this PR
      const number = pr.number
      const listLabels = await getLabels(context, {owner, repo, number})

      app.log(listLabels)

      // Add Label if not added till now
      for( var i = 0;i < listLabels.length;i++) {
        labelsToAdd = [":exclamation: release-reminder"]
        for( var j = 0;j < labelsToAdd.length;j++){
          if(listLabels[i].name != labelsToAdd[j])
            result.push(context.github.issues.addLabels(context.issue({labels: labelsToAdd})))
        }
      }
    }

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
    }

    return result
  })
}
