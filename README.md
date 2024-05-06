# Sunodo

![Release Packages](https://github.com/sunodo/sunodo/actions/workflows/release.yaml/badge.svg)

Sunodo is a framework for developing decentralized applications built on top of [Cartesi](http://cartesi.io) technology.
It helps developers to:

-   `create` applications from templates
-   `build` applications from source to a Cartesi machine
-   `run` applications in a local development environment
-   `deploy` applications to a cloud provider

## Apps and Packages

-   `cli`: a [oclif](https://oclif.io) CLI tool for development, deployment and management of applications, available at `brew install sunodo/tap/sunodo`;
-   `docs`: a [VitePress](https://vitepress.dev/) app with Sunodo documentation, deployed at [https://docs.sunodo.io](https://docs.sunodo.io)
-   `web`: a [next.js](https://nextjs.org/) app for Sunodo website, deployed at [https://sunodo.io](https://sunodo.io)
-   `car-sync`: Utility library and CLI to download IPFS CAR to local filesystem;
-   `sdk`: Docker image to help with Cartesi build and execution;
-   `contracts`: smart contracts for application deployment;
-   `devnet`: local deployment of Cartesi contracts and token test contracts;
-   `eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
-   `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Dependencies

Sunodo uses Anvil commands. To install Anvil, you need to follow the instructions [here](https://book.getfoundry.sh/getting-started/installation#using-foundryup)

## Build

To build all apps and packages, run the following command:

```shell
cd sunodo
pnpm run build
```

## Develop

To develop all apps and packages, run the following command:

```shell
cd sunodo
pnpm run dev
```
