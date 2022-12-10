import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const run = async () => {
  const args = process.argv.slice(2);
  const userArg = args[0];
  const username = userArg.split("=")[1].trim();
  console.log(`Welcome to the File Manager, ${username}!`);

  const rl = readline.createInterface({ input, output });

  const command = await rl.question("What would you like to do today?\n");

  process.stdout.write(`You wanted ${command}!\n`);
};

run();
