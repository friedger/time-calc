import store from "store/dist/store.modern";
import Moment from "moment";
import "moment-duration-format";
import { parse } from "json2csv";

const blockstack = require("blockstack");

const STORE_CURRENT_PROJECT_ID = "currentProjectId";
const STORE_PROJECTS = "projects";
const STORE_TIMES = "times";
const STORE_PK_SAVED = "pkSaved";

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
      description: form.description,
      id: form.id,
      projectId: form.projectId
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
    return store.get(STORE_TIMES) || [];
  }

  static saveTimes(times) {
    store.set(STORE_TIMES, times);
  }
}

export class ProjectHelper {
  static loadCurrentProject() {
    let currentProjectId = store.get(STORE_CURRENT_PROJECT_ID) || undefined;
    let projects = ProjectHelper.loadProjects();
    let currentProject;

    if (currentProjectId) {
      currentProject = projects.find(p => p.id === currentProjectId);
    } else {
      currentProject = undefined;
    }

    if (!currentProject) {
      currentProject = ProjectHelper.createProject(projects);
    }

    return currentProject;
  }

  static createProject(projects, title) {
    let currentProject = {
      filename: "times.json",
      title: title || "Unnamed",
      id: uuid()
    };
    projects.push(currentProject);
    store.set(STORE_PROJECTS, projects);
    store.set(STORE_CURRENT_PROJECT_ID, currentProject.id);
    return currentProject;
  }

  static saveCurrentProject(project) {
    if (!project.id) {
      project.id = uuid();
    }
    if (!project.filesname) {
      project.filename = "times.json";
    }

    let projects = ProjectHelper.loadProjects();

    let index = projects.findIndex(p => p.id === project.id);
    if (index < 0) {
      projects.push(project);
    } else {
      projects[index] = Object.assign(projects[index], project); // keep other properties
    }
    store.set(STORE_PROJECTS, projects);

    let currentProjectId = store.get(STORE_CURRENT_PROJECT_ID) || undefined;
    if (currentProjectId !== project.id) {
      store.set(STORE_CURRENT_PROJECT_ID, project.id);
    }
  }

  static loadProjects() {
    return store.get(STORE_PROJECTS) || [];
  }

  static saveProjects(projects) {
    store.set(STORE_PROJECTS, projects);
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

  static getAppBucketUrl(hubUrl, appPrivateKey) {
    return blockstack.getAppBucketUrl(hubUrl, appPrivateKey);
  }
}

export class SyncHelper {
  static savePubKey() {
    store.set(STORE_PK_SAVED, true);
    if (store.get(STORE_PK_SAVED)) {
      return;
    }
    let userData = blockstack.loadUserData();
    if (!userData) {
      return;
    }
    const publicKey = blockstack.getPublicKeyFromPrivate(
      userData.appPrivateKey
    );
    blockstack
      .putFile("key.json", JSON.stringify(publicKey), { encrypt: false })
      .then(() => {
        store.set(STORE_PK_SAVED, true);
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }

  static sync(filename) {
    return blockstack.putFile(
      filename,
      JSON.stringify(StoreHelper.loadTimes())
    );
  }

  static loadTimes(filename) {
    return blockstack.getFile(filename).then(
      function(timesString) {
        if (timesString) {
          return JSON.parse(timesString).filter(t => t != null);
        } else {
          return null;
        }
      },
      function(error) {
        // eslint-disable-next-line no-console
        console.log("error load " + error);
        return [];
      }
    );
  }

  static loadSharedTimes(filename, username) {
    const profile = blockstack.loadUserData();
    const options = { decrypt: false, username };
    const sharedFilename = `shared/${profile.username}/${filename}`;
    return blockstack.getFile(sharedFilename, options).then(
      fileString => {
        if (fileString) {
          const plainContent = blockstack.decryptContent(fileString);
          const contentJSON = JSON.parse(plainContent);
          console.log(contentJSON)
          if (Object.prototype.hasOwnProperty.call(contentJSON, "times")) {
            return { ...contentJSON, owner: username };
          } else if (Array.isArray(contentJSON)) {
            return { times: contentJSON, owner: username };
          } else {
            return { times: [], owner: username };
          }
        } else {
          throw Error(
            `Timesheet was not shared with you (${profile.username}).Contact ${username}`
          );
        }
      },
      error => {
        // eslint-disable-next-line no-console
        console.log("error load " + error);
        return { times: [], owner: username };
      }
    );
  }

  static syncProjects() {
    blockstack.putFile(
      "projects.json",
      JSON.stringify(ProjectHelper.loadProjects())
    );
  }

  static loadProjects() {
    return blockstack.getFile("projects.json").then(projectsString => {
      if (!projectsString) {
        return [];
      }
      try {
        const result = JSON.parse(projectsString);
        return result;
      } catch (e) {
        return [];
      }
    });
  }

  static archiveProject(project) {
    return blockstack.putFile(
      `${project.id}/project.json`,
      JSON.stringify(project)
    );
  }

  static unarchiveProject(projectId) {
    return blockstack
      .getFile(`${projectId}/project.json`)
      .then(projectString => {
        if (projectString) {
          return JSON.parse(projectString);
        } else {
          // TODO inspect the folder for possible timesheet files
          return { id: projectId, title: "Unnamed", filename: "times.json" };
        }
      });
  }

  static allFiles() {
    const files = [];
    let profile = blockstack.loadUserData();

    return blockstack
      .getAppBucketUrl(profile.hubUrl, profile.appPrivateKey)
      .then(bucketUrl => {
        return blockstack
          .listFiles(f => {
            files.push(bucketUrl + f);
            return true;
          })
          .then(function() {
            return files;
          });
      });
  }

  static requestApproval(filename, username, project) {
    return () => {
      const options = {
        decrypt: false,
        username,
        zoneFileLookupURL: "https://core.blockstack.org/v1/names"
      };
      try {
        return blockstack.getFile("key.json", options).then(
          file => {
            const publicKey = JSON.parse(file);
            const sharedFilename = `shared/${username}/${filename}`;
            const times = StoreHelper.loadTimes().filter(t => t.projectId === project.id)
            return blockstack.putFile(
              sharedFilename,
              blockstack.encryptContent(
                JSON.stringify({ times, project }),
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

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
