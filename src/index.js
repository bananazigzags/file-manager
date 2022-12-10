import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { os } from "./os.js";
import { OS_COMMAND_OPTIONS_MSG } from "./constants.js";

const run = async () => {
  const args = process.argv.slice(2);
  const userArg = args[0];
  const username = userArg.split("=")[1].trim();
  console.log(`Welcome to the File Manager, ${username}!`);

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
};

run();
