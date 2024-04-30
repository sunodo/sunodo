# Creating application

:::warning
The Sunodo CLI is deprecated in favor of the new Cartesi CLI tool. Please refer to the [Cartesi documentation](https://docs.cartesi.io) for the most up-to-date information. If you have a Sunodo application and need to migrate to a Cartesi CLI application refer to the [migration guide](/guide/introduction/migrating).
:::

One of `cartesi`'s goal is to be the easiest way to create new [Cartesi](https://cartesi.io) applications from scratch.

To create a new application from a basic javascript template, run:

```shell
$ cartesi create my-app --template javascript
✔ Application created at my-app
```

This will create a new directory called `my-app` with a basic javascript nodejs template, with the following files:

-   `Dockerfile`: The Dockerfile used to build the application.
-   `README.md`: general guidance to how go from there
-   `package.json`: the application's package.json file with basic dependencies
-   `src/index.js`: the application entrypoint

To build the application for the first time, follow the [building](../building/building-application.md) guide. To learn more about other templates, follow to the [available templates](./available-templates.md) section.
