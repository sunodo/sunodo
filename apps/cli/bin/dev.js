#!/usr/bin/env yarn ts-node

import oclif from "@oclif/core";
import path from "node:path";
import url from "node:url";
import { register } from "ts-node";

// In dev mode -> use ts-node and dev plugins
process.env.NODE_ENV = "development";
process.env.DEFAULT_API_URL = "http://127.0.0.1:3001";
process.env.AUTH_ISSUER = "https://dev-0y8qxgon5zsrd7s1.us.auth0.com";
process.env.AUTH_CLIENT_ID = "vUR2kchV4dqerbIUP3CRuAIgurTPsrJN";

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
