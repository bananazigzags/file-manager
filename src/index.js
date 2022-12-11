import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { sep, join, parse } from "node:path";
import { homedir } from "node:os";
import { readdir } from "node:fs";
import { stat } from "node:fs/promises";
import { list } from "./directoryOperations.js";
import { os } from "./os.js";
import { getUsername } from "./args.js";
import { OS_COMMAND_OPTIONS_MSG } from "./constants.js";

const getDirectoryMessage = (directory) => {
  return `You are currently in ${directory}${sep}`;
};

const run = async () => {
  const username = getUsername();
  let currentDirectory = homedir();
  console.log(`Welcome to the File Manager, ${username}!`);
  console.log(getDirectoryMessage(currentDirectory));

  const rl = readline.createInterface({ input, output });
  let firstCommand = true;
  while (true) {
    let userInput;
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
    }

    if (option) {
      if (!option.startsWith("--")) {
        console.log(OS_COMMAND_OPTIONS_MSG);
      } else {
        const cleanOption = option.slice(2);
        switch (command) {
          case "os":
            const result = await os(cleanOption);
            console.log(result);
            break;
          case "hello":
            output.write("hello");
            break;
          default:
            console.log("Invalid command");
        }
      }
    }
  }
};

run();
