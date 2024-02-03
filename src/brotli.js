import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import { pipeline } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { DEFAULT_ERROR_MSG } from "./constants.js";
import { validatePath } from "./validation.js";

export const compressBrotli = async (pathToFile, pathToDest) => {
  validatePath(pathToFile);
    const brotli = createBrotliCompress();
    const fileToZip = createReadStream(pathToFile);
    const destination = createWriteStream(pathToDest);
    try {
      await pipeline(fileToZip, brotli, destination)
      return "File successfully compressed"
    } catch (err) {
      console.log(DEFAULT_ERROR_MSG)
    }
};

export const decompressBrotli = async (pathToFile, pathToDest) => {
  validatePath(pathToFile);
    const unzip = createBrotliDecompress();
    const fileToZip = createReadStream(pathToFile);
    const destination = createWriteStream(pathToDest);
    try {
      await pipeline(fileToZip, unzip, destination);
      return "File successfully decompressed"
    } catch (err) {
      console.log(DEFAULT_ERROR_MSG)
    }
};
