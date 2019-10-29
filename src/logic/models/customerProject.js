import { Collection } from "blockstack-collections";
import { Contact } from "blockstack-collections";

export class CustomerProject extends Collection {
  static get collectionName() {
    return "customerProject";
  }

  static schemaVersion = "1.0";

  static schema = {
    schemaVersion: String,
    identifier: String,
    title: String,
    customer: Contact,
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
