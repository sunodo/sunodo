#!/usr/bin/env node --no-warnings=ExperimentalWarning --loader ts-node/esm

import oclif from "@oclif/core";
import path from "node:path";
import url from "node:url";
import { register } from "ts-node";

// In dev mode -> use ts-node and dev plugins
process.env.NODE_ENV = "development";

const project = path.join(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "..",
    "tsconfig.json"
);
register({ project });

// In dev mode, always show stack traces
oclif.settings.debug = true;

// Start the CLI
oclif
    .run(process.argv.slice(2), import.meta.url)
    .then(oclif.flush)
    .catch(oclif.Errors.handle);
