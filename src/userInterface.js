import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export class UserInterface {
  constructor(username) {
    this.username = username
    this.isFirstQuestion = true

    this.rl = readline.createInterface({ input, output });
    this.rl.on("SIGINT", () => {
      process.emit("SIGINT");
    });

    process.on("SIGINT", () => {
      console.log(`Thank you for using File Manager, ${this.username}, goodbye!`);
      process.exit(0);
    });
  }

  greet() {
    console.log(`Welcome to the File Manager, ${this.username}!`);
  }

  async prompt () {
    let question;
    if (this.isFirstQuestion) {
      this.isFirstQuestion = false
      question = "What would you like to do today?\n"
    } else {
      question = "Anything else?\n"
    }

    const userInput = await this.rl.question(question)
    return userInput
  }

  
}