#!/usr/bin/env node

import oclif from "@oclif/core";
process.env.DEFAULT_API_URL = "https://api.sunodo.io";
process.env.AUTH_ISSUER = "https://auth.sunodo.io";
process.env.AUTH_CLIENT_ID = "b0KzMhxItFURlEl9obWRTH1416o0kn82";

oclif
    .run(process.argv.slice(2), import.meta.url)
    .then(oclif.flush)
    .catch(oclif.Errors.handle);
