#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Api } from "../lib/api";

const app = new cdk.App();
new Api(app, "Api");
