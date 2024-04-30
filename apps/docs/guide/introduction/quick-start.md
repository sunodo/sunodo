# Quick start

:::warning
The Sunodo CLI is deprecated in favor of the new Cartesi CLI tool. Please refer to the [Cartesi documentation](https://docs.cartesi.io) for the most up-to-date information. If you have a Sunodo application and need to migrate to a Cartesi CLI application refer to the [migration guide](/guide/introduction/migrating).
:::

The following commands will get you started with a javascript project, build a Cartesi machine and run a local node for the application:

```shell
cartesi create my-app --template javascript
cd my-app
cartesi build
cartesi run
```

This will run an [anvil](https://book.getfoundry.sh/reference/anvil/) node as a local blockchain, and the GraphQL service and Inspect Service.

Other [project templates](/guide/creating/available-templates) are available, and contributions are always welcome.

For details on creating applications check the [creating application](/guide/creating/creating-application) section. For details on the build process of the application check the [building application](/guide/building/building-application) section. For details on the execution of the local node check the [running application](/guide/running/running-application) section.
