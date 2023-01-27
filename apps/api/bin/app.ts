#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { App } from "../lib/app";

const app = new cdk.App();
new App(app, "app", {
    auth: {
        issuer: "https://dev-0y8qxgon5zsrd7s1.us.auth0.com",
        clientId: "vUR2kchV4dqerbIUP3CRuAIgurTPsrJN",
        clientSecret: "", // TODO: use a secret for this value, or for all values above
    },
});
