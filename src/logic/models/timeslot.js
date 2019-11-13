import { Collection } from "blockstack-collections";
import { CustomerProject } from "./customerProject"

export class Denomination {
  unit
  value
}

export class WorkEntry extends Collection {
  static get collectionName() {
    return "workEntry";
  }

  static schemaVersion = "1.0";

  static schema = {
    schemaVersion: String,
    identifier: String,
    project: CustomerProject,
    startDate: Number, // as minutes since 1/1/1970
    endDate: Number, // as minutes since 1/1/1970
    break: Number, // in minutes
    duration: Number, // in minutes
    hourlyRate: Denomination,
    description: String
  };

  constructor(attrs = {}) {
    super(attrs);
  }

  collectionName() {
    return CustomerProject.collectionName;
  }

  static fromData(data) {
    return this.fromJSON(data);
  }

  static fromJSON(data) {
    return new CustomerProject(JSON.parse(data));
  }

  serialize() {
    return this.toJSON();
  }

  toJSON() {
    return JSON.stringify(this.attrs);
  }
}
