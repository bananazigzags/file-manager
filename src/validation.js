import { existsSync } from "node:fs";
import { DEFAULT_ERROR_MSG } from "./constants.js";

export const validatePath = (path) => {
  if (!existsSync(path)) {
    throw new Error(DEFAULT_ERROR_MSG);
  } else return true
}