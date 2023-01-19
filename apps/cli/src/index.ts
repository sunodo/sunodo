#!/usr/bin/env node

import yargs from "yargs";

yargs
    .version()
    .commandDir("commands", { extensions: ["js", "ts"] })
    .strict().argv;
