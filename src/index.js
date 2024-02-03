import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { homedir } from "node:os";
import { calculateHash } from "./hash.js";
import { list, up } from "./directoryOperations.js";
import { os } from "./os.js";
import { getUsername } from "./args.js";
import { DEFAULT_ERROR_MSG } from "./constants.js";
import { add, read, rm, rn, copy, mv } from "./fileOperations.js";
import { compressBrotli, decompressBrotli } from "./brotli.js";
import { VirtualDirectory } from "./virtualDirectory.js";
import { validateCommand } from "./validation.js";

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
    const arg1 = userInput[1];
    const arg2 = userInput[2];

    const commandHandlers = {
      add: async () => add(vDir.append(arg1)),
      cat: async () => read(vDir.append(arg1)),
      cd: () => vDir.changeDirectory(vDir.append(arg1)),
      compress: async () => compressBrotli(vDir.append(arg1), vDir.append(`${arg2}.br`)),
      cp: async () => copy(vDir.append(arg1), vDir.append(arg2)),
      decompress: async () => decompressBrotli(vDir.append(arg1), vDir.append(arg2)),
      hash: async () => calculateHash(vDir.append(arg1)),
      ls: async () => await list(vDir.getCurrent()),
      mv: async () => mv(vDir.append(arg1), vDir.append(arg2)),
      os: () => os(arg1),
      ['.exit']: () => process.emit("SIGINT"),
      rm: async () => rm(vDir.append(arg1)),
      rn: async () => rn(vDir.append(arg1), arg2),
      up: () => vDir.changeDirectory(up(vDir.getCurrent())),
    }

    try {
      if (commandHandlers.hasOwnProperty(command) && validateCommand(command, userInput.length - 1)) {
        const result = await commandHandlers[command]?.();
        const shouldLogResult = !['up', 'cd', '.exit'].includes(command);
        if (shouldLogResult) {
          command === 'ls' ? console.table(result) : console.log(result)
        }
      } else {
        console.log('Invalid input')
      }
    } catch (err) {
      console.log(DEFAULT_ERROR_MSG);
    } finally {
      vDir.printDirectoryMessage();
    }
  }
};

run();
