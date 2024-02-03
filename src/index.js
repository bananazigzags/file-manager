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
import { UserInterface } from "./userInterface.js";

const run = async () => {
  const username = getUsername();
  const vDir = new VirtualDirectory(homedir());
  const host = new UserInterface(username);
  
  host.greet()
  vDir.printDirectoryMessage();

  let userInput;
  while (true) {
    userInput = (await host.prompt()).split(' ')

    const [ command, arg1, arg2 ] = userInput;
   
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
