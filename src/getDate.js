
const moment = require('moment')

module.exports = {
  getDayBeforeDate: (date) => {
    console.log('In getDate.js getDayBeforeDate...')
    return moment(date).subtract(1, 'days').format()
  }
}
