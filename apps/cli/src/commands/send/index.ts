import { Command, Interfaces } from "@oclif/core";

import { BaseCommand } from "../../baseCommand.js";

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
    (typeof SendBaseCommand)["baseFlags"] & T["flags"]
>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T["args"]>;

// base command for sending input to the application
export abstract class SendBaseCommand<
    T extends typeof Command,
> extends BaseCommand<typeof SendBaseCommand> {
    protected flags!: Flags<T>;
    protected args!: Args<T>;

    public async init(): Promise<void> {
        await super.init();
        const { args, flags } = await this.parse({
            flags: this.ctor.flags,
            baseFlags: (super.ctor as typeof SendBaseCommand).baseFlags,
            args: this.ctor.args,
            strict: this.ctor.strict,
        });
        this.flags = flags as Flags<T>;
        this.args = args as Args<T>;
    }

    public async run(): Promise<void> {
        this.error(
            "Sunodo CLI is deprecated, please uninstall it and install Cartesi CLI",
        );
    }
}

export default class Send extends Command {
    static summary = "Send input to the application.";

    static description =
        "Sends different kinds of input to the application in interactive mode.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public async run(): Promise<void> {
        this.error(
            "Sunodo CLI is deprecated, please uninstall it and install Cartesi CLI",
        );
    }
}
