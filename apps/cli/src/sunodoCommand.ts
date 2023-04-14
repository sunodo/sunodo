import { Command, Config } from "@oclif/core";

export abstract class SunodoCommand extends Command {
    protected constructor(argv: string[], config: Config) {
        super(argv, config);
    }
}
