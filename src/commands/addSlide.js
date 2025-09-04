import { select, Separator, number } from "@inquirer/prompts";
import { addSlide } from "../lib/slide.js";
import chalk from "chalk";

async function askMenu() {
  return await select({
    message: "What do you want to do next?",
    choices: [
      { name: "Add More Slide(s)", value: "addNew" },
      new Separator(),
      { name: chalk.bold.yellow("Back"), value: "back" },
      new Separator(" "),
    ],
  });
}

async function askNextSlide() {
  let res = {
    index: await number({ message: "Where do you want to add this slide?" }),
    quantity: await number({
      message: "How many slides do you want to add?",
    }),
  };

  return res;
}

const askQuestions = async () => {
  const queueArray = [];
  try {
    let nextSlide, nextAction;
    do {
      nextSlide = await askNextSlide();
      if (nextSlide.type === "back") {
        return queueArray;
      }
      queueArray.push(nextSlide);
      nextAction = await askMenu();
    } while (nextAction !== "back");
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
    } else {
      throw error;
    }
  }

  return queueArray;
};

export default async function addSlideCommand() {
  try {
    const queue = await askQuestions();
    // console.log(queue);
    if (queue === undefined || queue.length === 0) {
      return;
    }
    for (let i in queue) {
      const res = queue[i];
      addSlide(res);
    }
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
    } else {
      throw error;
    }
  }
}
