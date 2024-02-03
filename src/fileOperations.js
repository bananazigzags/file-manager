import {
  createReadStream,
  createWriteStream,
  existsSync,
} from "node:fs";
import { pipeline } from 'node:stream/promises';
import {
  unlink,
  open,
  rename,
  mkdir
} from "node:fs/promises"
import { sep, join } from "node:path";
import { validatePath } from "./validation.js";

export const read = async (path) => {
  validatePath(path)
  const fileContent = createReadStream(path);
  let promise = new Promise((resolve) => {
    let result = "";
    fileContent.on("data", (chunk) => {
      result += chunk.toString();
    });
    fileContent.on("end", () => {
      resolve(result);
    });
  });
  return promise;
};

export const add = async (path) => {
  return new Promise(async (resolve, reject) => {
    try {
      await open(path, "wx")
      resolve(`File is created successfully at ${path}`)
    } catch (err) {
      reject(err)
    }
  });
};

export const rm = async (path) => {
  return new Promise(async (resolve, reject) => {
    try {
      await unlink(path);
      resolve("File successfully deleted");
    } catch (err) {
      reject(err)
    }
  });
};

export const rn = async (path, newName) => {
  validatePath(path);
  return new Promise(async (resolve, reject) => {
    const splitPath = path.split(sep);
    splitPath.splice(-1, 1, newName);
    const newPath = splitPath.join(sep);
    
    if(existsSync(newPath)) reject()

    await rename(path, newPath);
    resolve(`File successfully renamed. New path is ${newPath}`);
  });
};

export const copy = async (pathToFile, pathToNewDir) => {
  const splitPath = pathToFile.split(sep);
  const fileName = splitPath.slice(-1)[0];
  const newFilePath = join(pathToNewDir, fileName);

  return new Promise(async (resolve, reject) => {
    if(existsSync(pathToNewDir)) reject();

    try {
      await mkdir(pathToNewDir);
      const readable = createReadStream(pathToFile);
      const writable = createWriteStream(newFilePath);

      pipeline(readable, writable);

      resolve("File successfully copied");
    } catch (err) {
      reject(err)
    }
  });
};

export const mv = async (pathToFile, pathToNewDir) => {
  return new Promise(async (resolve, _) => {
    await copy(pathToFile, pathToNewDir);
    await rm(pathToFile);
    resolve("File moved successfully");
  });
};
