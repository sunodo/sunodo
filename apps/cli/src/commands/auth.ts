import { Argv } from "yargs";

export const command = "auth <command>";
export const desc = "Authentication and Signup";

export const builder = (yargs: Argv) =>
    yargs.commandDir("auth_commands", { extensions: ["js", "ts"] });

export const handler = () => {};
