# Migrating a Sunodo project

This section describe the steps to take to migrate a Sunodo application to a Cartesi CLI application.

1. uninstall Sunodo CLI;

    - `brew uninstall sunodo` if installed using brew
    - `npm uninstall -g sunodo` if installed using npm

2. [install Cartesi CLI](/guide/introduction/installing.md);

3. review your Dockerfile, possibly replacing with a fresh one from [https://github.com/cartesi/application-templates](https://github.com/cartesi/application-templates);

4. rename the `.sunodo` directory to `.cartesi`;

5. change the `.gitignore` file to ignore the `.cartesi` directory instead of the `.sunodo` directory;

6. rename the `.sunodo.env` file to `.cartesi.env` if you have one.
