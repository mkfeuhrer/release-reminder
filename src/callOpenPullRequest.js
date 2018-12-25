module.exports = async (context, {owner, repo, openPullRequests, result}) => {
    
  // Only update open pull request with labels and comments
  const getLabels = require('./getLabels')
  console.log("Number of OpenPullRequests :" + openPullRequests.length)
  
  for( var i = 0;i < openPullRequests.length;i++) {
      
      // use github.issues.createComment endpoint for commenting on a PR
      // https://octokit.github.io/rest.js/#api-Issues-createComment
      const pr = openPullRequests[i]
      // const remainingDays = getDate.getDayBeforeDate(config.creationTime)
      // const params = context.issue({number: pr['number'], body: 'Reminder : Next Release Date is in x days , Please merge the PR before that!' })
      // result.push(context.github.issues.createComment(params));
      
      // Fetch labels for this PR
      const number = pr.number
      const listLabels = await getLabels(context, {owner, repo, number})
      const labelsToAdd = [":exclamation: release-reminder"]

      // Check if any label exists
      if(listLabels.length == 0){
        result.push(context.github.issues.addLabels(context.issue({number: number,labels: labelsToAdd})))
      }
      else {
        // Add Labels if not added till now
        for( var i = 0;i < listLabels.length;i++) {
          for( var j = 0;j < labelsToAdd.length;j++){
            if(listLabels[i].name != labelsToAdd[j])
              result.push(context.github.issues.addLabels(context.issue({number: number,labels: labelsToAdd})))
          }
        }
      }
  }
  return
}