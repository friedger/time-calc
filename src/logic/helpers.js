import store from 'store/dist/store.modern'
import Moment from 'moment'
import 'moment-duration-format'
import {parse} from 'json2csv'

const blockstack = require('blockstack')

export class CalculationHelper {
  static fetchCalculation (form) {
    return CalculationHelper.calculateLocal(form)
  }

  static calculateLocal (form) {
    const breakDuration = Moment.duration(form.break)
    const startDate = new Moment(form.start, 'HH:mm')
    const endDate = new Moment(form.end, 'HH:mm')
    const milliseconds = endDate.subtract(breakDuration).diff(startDate)
    const duration = Moment.duration(milliseconds / 1000, 'seconds').format('HH:mm', {trim: false})

    return {
      start: form.start,
      end: form.end,
      break: form.break,
      duration: duration,
      date: form.date,
      description: form.description
    }
  }
}

export class TimeHelper {
  static sortTimes (times) {
    return times.sort((a, b) => {
      a = Moment(a.date, 'L')
      b = Moment(b.date, 'L')

      if (a.isBefore(b)) {
        return -1
      }

      if (a.isAfter(b)) {
        return 1
      }
      return 0
    })
  }

  static downloadTimes (times) {
    if (!times) {
      return
    }

    const headers = Object.getOwnPropertyNames(times[0]).filter((name) => name !== 'index')
    const csv = parse(times, { fields: headers })
    const csvContent = 'data:text/csv;charset=utf-8;base64,' + btoa(csv)

    window.open(csvContent)
  }

  static moment (value, format) {
    if (value instanceof Moment) {
      return value.format(format)
    }

    if (value) {
      return new Moment(value, format)
    }

    return new Moment()
  }

  static now () {
    return TimeHelper.time(new Moment())
  }

  static today () {
    return TimeHelper.date(new Moment())
  }

  static time (value) {
    return TimeHelper.moment(value, 'HH:mm')
  }

  static date (value) {
    return TimeHelper.moment(value, 'L')
  }
}

export class StoreHelper {
  static loadTimes () {
    return store.get('times') || []
  }

  static saveTimes (times) {
    store.set('times', times)
  }
}

export class UserHelper {
  static signIn () {
    blockstack.redirectToSignIn()
  }

  static signOut () {
    blockstack.signUserOut()
  }

  static isSignInPending() {
    return blockstack.isSignInPending()
  }

  static handlePendingSignIn() {
    return blockstack.handlePendingSignIn()
  }

  static isUserSignedIn() {
    return blockstack.isUserSignedIn()
  }

  static loadUserData() {
    return blockstack.loadUserData()
  }
}

export class SyncHelper {
  static sync() {
    return blockstack.putFile("times.json", JSON.stringify(StoreHelper.loadTimes()))
  }

  static init() {
    return blockstack.getFile("times.json").then( function(timesString) {
      return JSON.parse(timesString)
    }, function(error) {
      // eslint-disable-next-line no-console
      console.log("error init " + error)
      return []
    })
  }
}
