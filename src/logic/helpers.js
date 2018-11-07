import store from "store/dist/store.modern";
import Moment from "moment";
import "moment-duration-format";
import { parse } from "json2csv";

const blockstack = require("blockstack");

export class CalculationHelper {
  static fetchCalculation(form) {
    return CalculationHelper.calculateLocal(form);
  }

  static calculateLocal(form) {
    const breakDuration = Moment.duration(form.break);
    const startDate = new Moment(form.start, "HH:mm");
    const endDate = new Moment(form.end, "HH:mm");
    const milliseconds = endDate.subtract(breakDuration).diff(startDate);
    const duration = Moment.duration(milliseconds / 1000, "seconds").format(
      "HH:mm",
      { trim: false }
    );

    return {
      start: form.start,
      end: form.end,
      break: form.break,
      duration: duration,
      date: form.date,
      description: form.description
    };
  }
}

export class TimeHelper {
  static sortTimes(times) {
    return times.sort((a, b) => {
      a = Moment(a.date, "L");
      b = Moment(b.date, "L");

      if (a.isBefore(b)) {
        return -1;
      }

      if (a.isAfter(b)) {
        return 1;
      }
      return 0;
    });
  }

  static downloadTimes(times) {
    if (!times) {
      return;
    }

    const headers = Object.getOwnPropertyNames(times[0]).filter(
      name => name !== "index"
    );
    const csv = parse(times, { fields: headers });
    const csvContent = "data:text/csv;charset=utf-8;base64," + btoa(csv);

    window.open(csvContent);
  }

  static moment(value, format) {
    if (value instanceof Moment) {
      return value.format(format);
    }

    if (value) {
      return new Moment(value, format);
    }

    return new Moment();
  }

  static now() {
    return TimeHelper.time(new Moment());
  }

  static today() {
    return TimeHelper.date(new Moment());
  }

  static time(value) {
    return TimeHelper.moment(value, "HH:mm");
  }

  static date(value) {
    return TimeHelper.moment(value, "L");
  }
}

export class StoreHelper {
  static loadTimes() {
    return store.get("times") || [];
  }

  static saveTimes(times) {
    store.set("times", times);
  }
}

export class UserHelper {
  static signIn() {
    try {
      blockstack.redirectToSignIn(
        `${window.location.origin}/`,
        `${window.location.origin}/manifest.json`,
        ["store_write", "publish_data"]
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  static signOut() {
    blockstack.signUserOut();
  }

  static isSignInPending() {
    return blockstack.isSignInPending();
  }

  static handlePendingSignIn() {
    return blockstack.handlePendingSignIn();
  }

  static isUserSignedIn() {
    return blockstack.isUserSignedIn();
  }

  static loadUserData() {
    return blockstack.loadUserData();
  }
}

export class SyncHelper {
  static savePubKey() {
    const publicKey = blockstack.getPublicKeyFromPrivate(
      blockstack.loadUserData().appPrivateKey
    );
    blockstack
      .putFile("key.json", JSON.stringify(publicKey), { encrypt: false })
      .then(() => {})
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }
  static sync() {
    return blockstack.putFile(
      "times.json",
      JSON.stringify(StoreHelper.loadTimes())
    );
  }

  static init(normal) {
    if (normal) {
      return blockstack.getFile("times.json").then(
        function(timesString) {
          // eslint-disable-next-line no-console
          console.log("times " + timesString);
          return JSON.parse(timesString).filter(t => t != null);
        },
        function(error) {
          // eslint-disable-next-line no-console
          console.log("error init " + error);
          return [];
        }
      );
    } else {
      const profile = blockstack.loadUserData();
      const options = { decrypt: false, username: "friedger.id" };
      const filename = `shared/${profile.username}/times.json`;
      // eslint-disable-next-line no-console
      console.log("loading " + filename);
      return blockstack.getFile(filename, options).then(
        function(timesString) {
          // eslint-disable-next-line no-console
          console.log("times " + timesString);
          return JSON.parse(blockstack.decryptContent(timesString)).filter(t => t != null);
        },
        function(error) {
          // eslint-disable-next-line no-console
          console.log("error init " + error);
          return [];
        }
      );
    }
  }

  static requestApproval(username) {
    return () => {
      // eslint-disable-next-line no-console
      console.log("get key for " + username);
      const options = {
        decrypt: false,
        username,
        zoneFileLookupURL: "https://core.blockstack.org/v1/names"
      };
      try {
        blockstack.getFile("key.json", options).then(
          file => {
            // eslint-disable-next-line no-console
            console.log("key " + file);
            const publicKey = JSON.parse(file);
            return blockstack.putFile(
              "shared/" + username + "/times.json",
              blockstack.encryptContent(
                JSON.stringify(StoreHelper.loadTimes()),
                { publicKey }
              ),
              { encrypt: false }
            );
          },
          error => {
            // eslint-disable-next-line no-console
            console.log("err" + error);
          }
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("err" + e);
      }
    };
  }
}
