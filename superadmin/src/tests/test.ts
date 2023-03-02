import moment from 'moment'



const expectedTime = moment(Date.now()).subtract(5, 'hours')

console.log(Date.now(), expectedTime.isBefore())