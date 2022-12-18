import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { existsSync } from "node:fs";
import { sep, resolve } from "node:path";
import { homedir } from "node:os";
import { calculateHash } from "./hash.js";
import { list, up } from "./directoryOperations.js";
import { os } from "./os.js";
import { getUsername } from "./args.js";
import { OS_COMMAND_OPTIONS_MSG, DEFAULT_ERROR_MSG } from "./constants.js";
import { add, read, rm, rn, copy, mv } from "./fileOperations.js";
import { compressBrotli, decompressBrotli } from "./brotli.js";

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

    if (!option) {
      switch (command) {
        case ".exit":
          process.emit("SIGINT");
        case "up":
          currentDirectory = await up(currentDirectory);
          console.log(getDirectoryMessage(currentDirectory));
          break;
        case "ls":
          let dirToRead = currentDirectory.endsWith(":")
            ? currentDirectory + sep
            : currentDirectory;
          let result = await list(dirToRead);
          console.table(result);
        default:
          console.log("Invalid input");
          break;
      }
    }

    if (option) {
      if (command === "os" && !option.startsWith("--")) {
        console.log(OS_COMMAND_OPTIONS_MSG);
      } else {
        try {
          switch (command) {
            case "cd":
              let newDir = resolve(currentDirectory, option);
              if (!existsSync(newDir)) {
                console.log(DEFAULT_ERROR_MSG);
              } else {
                currentDirectory = newDir;
              }
              break;
            case "os":
              const cleanOption = option.slice(2);
              const result = await os(cleanOption);
              console.log(result);
              break;
            case "hash":
              const filePath = resolve(currentDirectory, option);
              if (!existsSync(filePath)) {
                throw new Error(DEFAULT_ERROR_MSG);
              }
              console.log(await calculateHash(filePath));
              break;
            case "cat":
              console.log(await read(resolve(currentDirectory, option)));
              break;
            case "add":
              console.log(await add(resolve(currentDirectory, option)));
              break;
            case "rm":
              console.log(await rm(resolve(currentDirectory, option)));
              break;
            case "rn":
              const newName = userInput[2];
              if (!existsSync(resolve(currentDirectory, option))) {
                throw new Error(DEFAULT_ERROR_MSG);
              }
              console.log(await rn(resolve(currentDirectory, option), newName));
              break;
            case "cp":
              const pathToNewDir = userInput[2];
              console.log(
                await copy(
                  resolve(currentDirectory, option),
                  resolve(currentDirectory, pathToNewDir)
                )
              );
              break;
            case "mv":
              const movePath = userInput[2];
              console.log(
                await mv(
                  resolve(currentDirectory, option),
                  resolve(currentDirectory, movePath)
                )
              );
              break;
            case "compress":
              const pathToDestZip = userInput[2];

              if (!existsSync(resolve(currentDirectory, option))) {
                throw new Error(DEFAULT_ERROR_MSG);
              }
              console.log(
                await compressBrotli(
                  resolve(currentDirectory, option),
                  resolve(currentDirectory, `${pathToDestZip}.br`)
                )
              );
              break;
            case "decompress":
              const pathToDestUnzip = userInput[2];
              if (!existsSync(resolve(currentDirectory, option))) {
                throw new Error(DEFAULT_ERROR_MSG);
              }
              console.log(
                await decompressBrotli(
                  resolve(currentDirectory, option),
                  resolve(currentDirectory, pathToDestUnzip)
                )
              );
              break;
            default:
              console.log("Invalid input");
          }
        } catch (err) {
          console.log(err.message);
        } finally {
          console.log(getDirectoryMessage(currentDirectory));
        }
      }
    }
  }
};

run();
