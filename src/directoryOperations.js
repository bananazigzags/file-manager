import { join } from "node:path";
import { stat, readdir } from "node:fs/promises";
import { sep, parse } from "node:path";

export const list = async (dir) => {
  let dirToRead = dir.endsWith(":") ? dir + sep : dir;

  const getFilesInfo = async (files) => {
    let filesInfo = [];
    files.forEach(async (file) => {
      let promise = new Promise(async (resolve, reject) => {
        let fileItem = {};
        fileItem["File name"] = file;
        try {
          let stats = await stat(join(dirToRead, file));
          fileItem["Type"] = stats.isDirectory() ? "directory" : "file";
          resolve(fileItem);
        } catch (error) {
          fileItem["Type"] = "unknown";
          resolve(fileItem);
        }
      });
      filesInfo.push(promise);
    });
    return await Promise.all(filesInfo);
  };

  try {
    let result = await readdir(dirToRead);
    let directories = [];
    let files = [];
    let unknown = [];

    let filesInfo = await getFilesInfo(result);

    filesInfo.forEach((file) => {
      switch (file["Type"]) {
        case "directory":
          directories.push(file);
          break;
        case "file":
          files.push(file);
          break;
        default:
          unknown.push(file);
      }
    });

    return [...directories, ...files, ...unknown];
  } catch {
    console.log("Operation failed");
  }
};

export const up = (currentDirectory) => {
  let newCurrentDirectory = currentDirectory;
  if (currentDirectory.endsWith(":")) {
    console.log("You are already in the root folder");
  } else {
    let directoryParts = currentDirectory.split(sep);
    directoryParts.pop();
    newCurrentDirectory = directoryParts.join(sep);
    if (currentDirectory.endsWith(":")) {
      newCurrentDirectory = parse(currentDirectory).root;
    }
  }
  return newCurrentDirectory;
};
