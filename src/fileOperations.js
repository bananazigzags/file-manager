import { createReadStream, open, unlink } from "node:fs";
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
