import { sep, resolve } from "node:path";

export class VirtualDirectory {
  constructor(homedir) {
    this.currentDirectory = homedir;
  }

  changeDirectory(directory) {
    this.currentDirectory = directory;
  }

  getCurrent() {
    return this.currentDirectory;
  }

  printDirectoryMessage() {
    console.log(`You are currently in ${this.getCurrent()}${sep}`)
  }

  append(option) {
    return resolve(this.getCurrent(), option);
  }

}