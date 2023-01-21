#!/usr/bin/env node

import yargs from "yargs";
import * as dotenv from "dotenv";
dotenv.config();

yargs
    .version()
    .commandDir("commands", { extensions: ["js", "ts"] })
    .strict().argv;
