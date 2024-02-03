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
  
  let promise = new Promise(async (resolve) => {
    let result = "";
    fileContent.on("data", (chunk) => result += chunk.toString());
    fileContent.on("end", () => resolve(result))
    });
  return promise;
};

export const add = async (path) => {
  await open(path, "wx")
  return `File is created successfully at ${path}`
};

export const rm = async (path) => {
  await unlink(path);
  return "File successfully deleted";
};

export const rn = async (path, newName) => {
  validatePath(path);
  const splitPath = path.split(sep);
  splitPath.splice(-1, 1, newName);
  const newPath = splitPath.join(sep);
  
  if(existsSync(newPath)) throw new Error()

  await rename(path, newPath);
  return `File successfully renamed. New path is ${newPath}`;
};

export const copy = async (pathToFile, pathToNewDir) => {
  validatePath(pathToFile)

  const splitPath = pathToFile.split(sep);
  const fileName = splitPath.pop();
  const newFilePath = join(pathToNewDir, fileName);

  if(existsSync(newFilePath)) throw new Error();

  if(!existsSync(pathToNewDir)) {
    await mkdir(pathToNewDir, { recursive: true } );
  }
  const readable = createReadStream(pathToFile);
  const writable = createWriteStream(newFilePath);

  pipeline(readable, writable);

  return "File successfully copied";
};

export const mv = async (pathToFile, pathToNewDir) => {
  await copy(pathToFile, pathToNewDir);
  await rm(pathToFile);
  return "File moved successfully";
};
