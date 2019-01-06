module.exports = async (context, {owner, repo, closedPullRequests, result}) => {
    const getLabels = require('./getLabels')
    // Working with closed pull request
    for(let i = 0;i < closedPullRequests.length;i++){      
        const pr = closedPullRequests[i]
        // Fetch labels for this PR
        const number = pr.number
        const listLabels = await getLabels(context, {owner, repo, number})
        // Remove Label if added till now      
        for( let k = 0;k < listLabels.length;k++) {
            labelsToAdd = [":exclamation: release-reminder"]
            for( let j = 0;j < labelsToAdd.length;j++){
                if(listLabels[k].name == labelsToAdd[j])
                    result.push(context.github.issues.removeLabel(context.issue({ number: number,name: labelsToAdd[j]})))
            }
        }
    }
    return
}