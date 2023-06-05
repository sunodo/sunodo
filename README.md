# Sunodo

Sunodo is a framework for developing decentralized applications built on top of [Cartesi](http://cartesi.io) technology.
It helps developers to:

-   `create` applications from templates
-   `build` applications from source to a cartesi machine
-   `run` applications in a local development environment
-   `test` applications running inside a cartesi machine
-   `deploy` applications to a cloud provider
-   `monitor` application already running on a cloud provider
-   `doctor` verify the minimal requirements for the sunodo execution commands

## What's inside?

This monorepo ([turborepo](https://turbo.build/repo)) includes libraries and applications for the upper part of the architecture diagram below.

![architecture](architecture.jpg)

### Apps and Packages

-   `cli`: a [oclif](https://oclif.io) CLI tool for deployment and management of DApps, available at `brew install sunodo`;
-   `controller`: a web3 application that monitor DApps deployments and launches cartesi nodes;
-   `docs`: a [docusaurus](https://docusaurus.io) app with Sunodo documentation, deployed at [https://docs.sunodo.io](https://docs.sunodo.io)
-   `web`: a [next.js](https://nextjs.org/) app for Sunodo website, deployed at [https://sunodo.io](https://sunodo.io)
-   `app`: a [next.js](https://nextjs.org/) app for Sunodo dashboard, deployed at [https://app.sunodo.io](https://app.sunodo.io)
-   `machine-emulator-tools`: packaging of cartesi machine emulator tools as Docker images;
-   `sdk`: Docker image to help with cartesi build and execution;
-   `contracts`: support smart contracts for node management;
-   `ui`: a stub React component library shared by both `web` and `app` applications
-   `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
-   `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

-   [TypeScript](https://www.typescriptlang.org/) for static type checking
-   [ESLint](https://eslint.org/) for code linting
-   [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```shell
cd sunodo
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```shell
cd sunodo
yarn run dev
```
