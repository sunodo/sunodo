# Cartesi CLI

![Release Packages](https://github.com/cartesi/cli/actions/workflows/release.yaml/badge.svg)

Cartesi CLI is a tool to help creating [Cartesi](http://cartesi.io) applications. It includes commands that help developers to:

-   `create` applications from templates
-   `build` applications from source to a Cartesi machine
-   `run` applications in a local development environment
-   `deploy` applications to a live networks

## Apps and Packages

-   `cli`: a [oclif](https://oclif.io) CLI tool for development, deployment and management of applications, available at `brew install cartesi/tap/cartesi`;
-   `sdk`: Docker image to help with Cartesi build and execution;
-   `contracts`: smart contracts for application deployment;
-   `devnet`: local deployment of Cartesi contracts and token test contracts;
-   `eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
-   `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Dependencies

This repo build uses Anvil commands. To install Anvil, you need to follow the instructions [here](https://book.getfoundry.sh/getting-started/installation#using-foundryup)

## Build

To build all apps and packages, run the following command:

```shell
pnpm run build
```
