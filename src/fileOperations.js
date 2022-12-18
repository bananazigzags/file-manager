import {
  rename,
  createReadStream,
  open,
  unlink,
  cp,
  createWriteStream,
  existsSync,
  mkdir,
} from "node:fs";
import { sep, join } from "node:path";
import { DEFAULT_ERROR_MSG } from "./constants.js";

export const read = async (path) => {
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
  return new Promise((resolve, reject) => {
    open(path, "wx", (err, file) => {
      if (err) {
        reject(new Error(DEFAULT_ERROR_MSG));
      } else {
        resolve(`File is created successfully at ${path}`);
      }
    });
  });
};

export const rm = async (path) => {
  return new Promise((resolve, reject) => {
    unlink(path, (err) => {
      if (err) {
        reject(new Error(DEFAULT_ERROR_MSG));
      } else {
        resolve("File successfully deleted");
      }
    });
  });
};

export const rn = async (path, newName) => {
  return new Promise((resolve, reject) => {
    const splitPath = path.split(sep);
    splitPath.splice(-1, 1, newName);
    const newPath = splitPath.join(sep);

    rename(path, newPath, (err) => {
      if (err) reject(new Error(DEFAULT_ERROR_MSG));
      resolve(`File successfully renamed. New path is ${newPath}`);
    });
  });
};

export const copy = async (pathToFile, pathToNewDir) => {
  const splitPath = pathToFile.split(sep);
  const fileName = splitPath.slice(-1)[0];
  const newFilePath = join(pathToNewDir, fileName);

  return new Promise((resolve, reject) => {
    if (!existsSync(pathToNewDir)) {
      mkdir(pathToNewDir, (err) => {
        if (err) reject(new Error(DEFAULT_ERROR_MSG));
      });
    }

    const readable = createReadStream(pathToFile);
    const writable = createWriteStream(newFilePath);

    readable.pipe(writable);
    writable.on("finish", () => {
      resolve("File successfully copied");
    });
  });
};

export const mv = async (pathToFile, pathToNewDir) => {
  return new Promise(async (resolve, reject) => {
    await copy(pathToFile, pathToNewDir);
    await rm(pathToFile);
    resolve("File moved successfully");
  });
};
