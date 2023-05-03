# Sunodo

![Release Packages](https://github.com/sunodo/sunodo/actions/workflows/release.yaml/badge.svg)

Sunodo is a framework for developing decentralized applications built on top of [Cartesi](http://cartesi.io) technology.
It helps developers to:

-   `create` applications from templates
-   `build` applications from source to a cartesi machine
-   `run` applications in a local development environment
-   `test` applications running inside a cartesi machine
-   `deploy` applications to a cloud provider
-   `monitor` application already running on a cloud provider
-   `doctor` verify the minimal requirements for the sunodo execution commands

## Apps and Packages

-   `cli`: a [oclif](https://oclif.io) CLI tool for development, deployment and management of DApps, available at `brew install sunodo`;
-   `docs`: a [VitePress](https://vitepress.dev/) app with Sunodo documentation, deployed at [https://docs.sunodo.io](https://docs.sunodo.io)
-   `web`: a [next.js](https://nextjs.org/) app for Sunodo website, deployed at [https://sunodo.io](https://sunodo.io)
-   `app`: a [next.js](https://nextjs.org/) app for Sunodo dashboard, deployed at [https://app.sunodo.io](https://app.sunodo.io)
-   `machine-emulator-tools`: packaging of cartesi machine emulator tools as Docker images;
-   `anvil`: Docker image of [anvil](https://book.getfoundry.sh/reference/anvil/), multi-arch;
-   `rollups-node`: Docker image of a cartesi node for a local devnet execution;
-   `sdk`: Docker image to help with cartesi build and execution;
-   `contracts`: smart contracts for application deployment;
-   `token`: ERC-20 token smart contract for testing;
-   `devnet`: Docker image for local devnet execution bundling cartesi and sunodo smart contracts;
-   `ui`: a stub React component library shared by both `web` and `app` applications
-   `wagmi-plugin-hardhat-deploy`: wagmi CLI [plugin](https://wagmi.sh/cli/plugins) which integrates with [hardhat-deploy](https://github.com/wighawag/hardhat-deploy) artifacts
-   `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
-   `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Build

To build all apps and packages, run the following command:

```shell
cd sunodo
yarn run build
```

## Develop

To develop all apps and packages, run the following command:

```shell
cd sunodo
yarn run dev
```
