import { createBrotliCompress } from "node:zlib";
import { pipeline } from "node:stream";
import { createReadStream, createWriteStream } from "node:fs";
import { DEFAULT_ERROR_MSG } from "./constants.js";

export const compressBrotli = async (pathToFile, pathToDest) => {
  return new Promise((resolve, reject) => {
    const brotli = createBrotliCompress();
    const fileToZip = createReadStream(pathToFile);
    const destination = createWriteStream(pathToDest);
    pipeline(fileToZip, brotli, destination, (err) => {
      if (err) {
        reject(new Error(DEFAULT_ERROR_MSG));
      } else {
        resolve("File successfully compressed");
      }
    });
  });
};
