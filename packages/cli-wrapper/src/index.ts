export class CLIWrapper {
    private builtCmd: string = "";
    private commandSet: boolean = false;
    public allowSubCommand: boolean = false;

    constructor() {
        this.builtCmd = "";
    }

    withArgs(args: string[]): CLIWrapper {
        if (!this.commandSet) {
            throw new Error("Command not set");
        }

        this.builtCmd += ` ${[...args].join(" ")}`;
        return this;
    }

    withCmd(cmd: string): CLIWrapper {
        if (this.commandSet) {
            this.builtCmd += " ";
            if (!this.allowSubCommand) {
                throw new Error("Command already set");
            }
        }

        this.builtCmd += cmd;
        this.commandSet = true;
        return this;
    }

    build(): string {
        return this.builtCmd;
    }

    //TODO: implement exec method
}
