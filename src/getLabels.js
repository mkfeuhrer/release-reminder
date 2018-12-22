module.exports = async (context, {owner, repo, number}) => {
    console.log('In getLabels.js...')
    let labels = await context.github.paginate(
      context.github.issues.listLabelsOnIssue({
        owner,
        repo,
        number,
        per_page: 100
      }),
      res => res.data
    )
    return labels
  }