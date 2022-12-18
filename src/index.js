import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { existsSync } from "node:fs";
import { sep, parse, resolve } from "node:path";
import { homedir } from "node:os";
import { calculateHash } from "./hash.js";
import { list } from "./directoryOperations.js";
import { os } from "./os.js";
import { getUsername } from "./args.js";
import { OS_COMMAND_OPTIONS_MSG, DEFAULT_ERROR_MSG } from "./constants.js";
import { add, read, rm } from "./fileOperations.js";

const getDirectoryMessage = (directory) => {
  return `You are currently in ${directory}${sep}`;
};

const run = async () => {
  const username = getUsername();
  let currentDirectory = homedir();
  console.log(`Welcome to the File Manager, ${username}!`);
  console.log(getDirectoryMessage(currentDirectory));

  const rl = readline.createInterface({ input, output });
  rl.on("SIGINT", () => {
    process.emit("SIGINT");
  });

  process.on("SIGINT", () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
  });

  let firstCommand = true;
  let userInput;
  while (true) {
    if (firstCommand) {
      userInput = (
        await rl.question("What would you like to do today?\n")
      ).split(" ");
      firstCommand = false;
    } else {
      userInput = (await rl.question("Anything else?\n")).split(" ");
    }
    const command = userInput[0];
    const option = userInput[1];

    switch (command) {
      case ".exit":
        process.emit("SIGINT");
      case "up":
        if (currentDirectory.endsWith(":")) {
          console.log("You are already in the root folder");
        } else {
          let directoryParts = currentDirectory.split(sep);
          directoryParts.pop();
          currentDirectory = directoryParts.join(sep);
          if (currentDirectory.endsWith(":")) {
            currentDirectory = parse(currentDirectory).root;
          }
        }
        console.log(getDirectoryMessage(currentDirectory));
        break;
      case "ls":
        let dirToRead = currentDirectory.endsWith(":")
          ? currentDirectory + sep
          : currentDirectory;
        let result = await list(dirToRead);
        console.table(result);
      default:
        break;
    }

    if (option) {
      if (command === "os" && !option.startsWith("--")) {
        console.log(OS_COMMAND_OPTIONS_MSG);
      } else {
        switch (command) {
          case "os":
            const cleanOption = option.slice(2);
            const result = await os(cleanOption);
            console.log(result);
            break;
          case "hash":
            const filePath = resolve(currentDirectory, option);
            console.log(filePath);
            try {
              if (!existsSync(filePath)) {
                throw new Error(DEFAULT_ERROR_MSG);
              }
              await calculateHash(filePath);
              console.log(getDirectoryMessage(currentDirectory));
            } catch (err) {
              console.log(err.message);
            }
            break;
          case "cat":
            try {
              let readResult = await read(resolve(currentDirectory, option));
              console.log(readResult);
              console.log(getDirectoryMessage(currentDirectory));
            } catch (err) {
              console.log(err.messge);
            }
            break;
          case "add":
            try {
              let result = await add(resolve(currentDirectory, option));
              console.log(result);
              console.log(getDirectoryMessage(currentDirectory));
            } catch (err) {
              console.log(err.message);
            }
            break;
          case "rm":
            try {
              console.log(await rm(resolve(currentDirectory, option)));
              console.log(getDirectoryMessage(currentDirectory));
            } catch (err) {
              console.log(err.message);
            }
            break;
          default:
            console.log("Invalid input");
        }
      }
    }
  }
};

run();
