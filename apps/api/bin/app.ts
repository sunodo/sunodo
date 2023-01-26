#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { App } from "../lib/app";

const app = new cdk.App();
new App(app, "app", {
    jwtIssuer: "https://dev-0y8qxgon5zsrd7s1.us.auth0.com",
});
