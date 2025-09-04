#! /usr/bin/env node
import 'dotenv/config'
import addSlide from "../src/commands/addSlide.js";
import moveSlide from "../src/commands/moveSlide.js";

import { Command } from "commander";
import { select, Separator } from "@inquirer/prompts";
import chalk from "chalk";

const program = new Command();
const actions = {
  addSlide: addSlide,
  moveSlide: moveSlide
};

program.name("IMI-CLI");

async function askNextAction() {
  let ch = [
    { name: "Add new slide(s)", value: "addSlide" },
    { name: "Move slide(s)", value: "moveSlide" },
  ];

  ch.push(
    new Separator(),
    { name: chalk.bold.yellow("Exit"), value: "exit" },
    new Separator(" ")
  );
  let action = await select({
    message: "What action do you want to take?",
    choices: ch,
  });

  return action;
}

program.action(async () => {
  try {
    let nextAction = await askNextAction();
    while (nextAction !== "exit") {
      await actions[nextAction]();
      nextAction = await askNextAction();
    }
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
    } else {
      throw error;
    }
  }
});

program.parse();
