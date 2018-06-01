import store from 'store/dist/store.modern'
import Moment from 'moment'
import 'moment-duration-format'
import json2csv from 'json2csv'

const blockstack = require('blockstack')

export class CalculationHelper {
  static fetchCalculation (form) {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => {
      resolve(CalculationHelper.calculateLocal(form))
    })
  }

  static calculateLocal (form) {
    const breakDuration = Moment.duration(form.value.break)
    const startDate = new Moment(form.value.start, 'HH:mm')
    const endDate = new Moment(form.value.end, 'HH:mm')
    const milliseconds = endDate.subtract(breakDuration).diff(startDate)
    const duration = Moment.duration(milliseconds / 1000, 'seconds').format('HH:mm', {trim: false})

    return {
      start: form.value.start,
      end: form.value.end,
      break: form.value.break,
      duration: duration,
      date: form.value.date
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

    const headers = Object.getOwnPropertyNames(times[0])
    const csv = json2csv({ data: times, fields: headers })
    const csvContent = 'data:text/csv;charset=utf-8;base64,' + btoa(csv)

    window.open(csvContent)
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
}

export class SyncHelper {
  static sync() {
    return blockstack.putFile("times.json", StoreHelper.loadTimes())
  }
}
