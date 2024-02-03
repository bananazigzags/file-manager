import { sep, resolve } from "node:path";
import { validatePath } from "./validation.js";

export class VirtualDirectory {
  constructor(homedir) {
    this.currentDirectory = homedir;
  }

  changeDirectory(directory) {
    validatePath(directory);
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