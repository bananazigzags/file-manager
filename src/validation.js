import { existsSync } from "node:fs";
import { DEFAULT_ERROR_MSG } from "./constants.js";

export const validatePath = (path) => {
  if (!existsSync(path)) {
    throw new Error(DEFAULT_ERROR_MSG);
  } else return true
}

const getExpectedArgumentNumber = (command) => {
  if (['add', 'cat', 'cd', 'hash', 'os', 'rm'].includes(command)) {
    return 1
  }
  if (['compress', 'cp', 'decompress', 'mv', 'rn'].includes(command)) {
    return 2
  }
  return 0
}

export const validateCommand = (command, argsLen) => {
  return getExpectedArgumentNumber(command) === argsLen;
}