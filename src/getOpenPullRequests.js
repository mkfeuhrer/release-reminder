module.exports = async (context, {owner, repo}) => {
  // method returns all the pull requests
  console.log('In getOpenPullRequests.js...')
  let pullRequests = await context.github.paginate(
    context.github.pullRequests.getAll({
      owner,
      repo,
      state: 'open',
      per_page: 100
    }),
    res => res.data
  )
  return pullRequests
}
