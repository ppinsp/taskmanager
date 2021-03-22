import Vue from 'vue'

const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')

dayjs.extend(advancedFormat)

Vue.filter('localDate', (date) => {
  if (date === null || date === '' || date === undefined) {
    return '-'
  }
  return dayjs(date).add(7, 'h').format('DD-MM-YYYY HH:mm')
})

export default Vue
