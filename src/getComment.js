function getComment (comment, defaultComment) {
    // set comment to default if none passed it
    const eventComment = comment || defaultComment
  
    // comment can be either a string or an array
    if (typeof eventComment === 'string' || eventComment instanceof String) {
      return eventComment
    } else {
      const pos = getRandomInt(0, comment.length)
      return eventComment[pos] || defaultComment
    }
  }
  
  function getRandomInt (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }
  
  module.exports = getComment
  