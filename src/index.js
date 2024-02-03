import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { sep, resolve } from "node:path";
import { homedir } from "node:os";
import { calculateHash } from "./hash.js";
import { list, up } from "./directoryOperations.js";
import { os } from "./os.js";
import { getUsername } from "./args.js";
import { OS_COMMAND_OPTIONS_MSG } from "./constants.js";
import { add, read, rm, rn, copy, mv } from "./fileOperations.js";
import { compressBrotli, decompressBrotli } from "./brotli.js";
import { validatePath } from "./validation.js";
import { VirtualDirectory } from "./virtualDirectory.js";

const run = async () => {
  const username = getUsername();
  const vDir = new VirtualDirectory(homedir());

  console.log(`Welcome to the File Manager, ${username}!`);
  
  vDir.printDirectoryMessage();

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
      try {
        switch (command) {
          case ".exit":
            process.emit("SIGINT");
          case "up":
            const newDirectory = await up(vDir.getCurrent())
            vDir.changeDirectory(newDirectory);
            break;
          case "ls":
            let result = await list(vDir.getCurrent());
            console.table(result);
            break;
          default:
            console.log("Invalid input");
            break;
        }
      } finally {
        vDir.printDirectoryMessage();
      }
    }

    if (option) {
        try {
          switch (command) {
            case "cd":
              let newDir = vDir.append(option);
              validatePath(newDir)
              vDir.changeDirectory(newDir)
              break;
            case "os":
              if(!option.startsWith("--")) {
                console.log(OS_COMMAND_OPTIONS_MSG)
              }
              const cleanOption = option.slice(2);
              const result = os(cleanOption);
              console.log(result);
              break;
            case "hash":
              const filePath = vDir.append(option);
              validatePath(filePath);
              console.log(await calculateHash(filePath));
              break;
            case "cat":
              console.log(await read(vDir.append(option)));
              break;
            case "add":
              console.log(await add(vDir.append(option)));
              break;
            case "rm":
              console.log(await rm(vDir.append(option)));
              break;
            case "rn":
              const fileToRename = vDir.append(option)
              const newName = userInput[2];
              validatePath(fileToRename)
              console.log(await rn(fileToRename, newName));
              break;
            case "cp":
              let currentDirectory = vDir.getCurrent()
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
                  vDir.append(option),
                  resolve(vDir.getCurrent(), movePath)
                )
              );
              break;
            case "compress":
              const pathToDestZip = userInput[2];
              const fileToCompress = resolve(currentDirectory, option);

              validatePath(fileToCompress)
              console.log(
                await compressBrotli(
                  fileToCompress,
                  resolve(vDir.getCurrent(), `${pathToDestZip}.br`)
                )
              );
              break;
            case "decompress":
              const pathToDestUnzip = userInput[2];
              const pathToDecompress = resolve(currentDirectory, option)
              validatePath(pathToDecompress)
              console.log(
                await decompressBrotli(
                  pathToDecompress,
                  resolve(vDir.getCurrent(), pathToDestUnzip)
                )
              );
              break;
            default:
              console.log("Invalid input");
          }
        } catch (err) {
          console.log(err.message);
        } finally {
          vDir.printDirectoryMessage();
        }
    }
  }
};

run();
