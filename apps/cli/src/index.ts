import { Builtins, Cli } from "clipanion";

import pkg from "../package.json";
import AddressBookCommand from "./commands/address-book.js";
import BuildCommand from "./commands/build.js";
import CleanCommand from "./commands/clean.js";
import CreateCommand from "./commands/create.js";
import DeployBuildCommand from "./commands/deploy/build.js";
import DeployCommand from "./commands/deploy/index.js";
import DoctorCommand from "./commands/doctor.js";
import HashCommand from "./commands/hash.js";
import RunCommand from "./commands/run.js";
import SendAddressCommand from "./commands/send/dapp-address.js";
import SendCommand from "./commands/send/index.js";
import ShellCommand from "./commands/shell.js";

const [, , ...args] = process.argv;
const cli = new Cli({
    binaryName: "sunodo",
    binaryLabel: "Sunodo",
    binaryVersion: pkg.version,
});

cli.register(Builtins.DefinitionsCommand);
cli.register(Builtins.HelpCommand);
cli.register(Builtins.TokensCommand);
cli.register(Builtins.VersionCommand);

cli.register(AddressBookCommand);
cli.register(BuildCommand);
cli.register(CleanCommand);
cli.register(CreateCommand);
cli.register(DeployCommand);
cli.register(DeployBuildCommand);
cli.register(DoctorCommand);
cli.register(HashCommand);
cli.register(RunCommand);
cli.register(SendCommand);
cli.register(SendAddressCommand);
cli.register(ShellCommand);
cli.runExit(args);
