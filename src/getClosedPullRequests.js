module.exports = async (context, {owner, repo}) => {
  // method returns all the pull requests
  console.log('In getAllPullRequests.js...')
  let pullRequests = await context.github.paginate(
    context.github.pullRequests.getAll({
      owner,
      repo,
      state: 'closed',
      per_page: 25
    }),
    res => res.data
  )
  return pullRequests
}
