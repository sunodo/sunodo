import { Command } from "@oclif/core";

/**
 * Logger interface.
 */
export interface Logger {
    debug(message: string): void;
    error(message: string): void;
    info(message: string): void;
    warn(message: string): void;
}

export class NullLogger implements Logger {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public debug(message: string): void {
        // no-op
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public error(message: string): void {
        // no-op
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public info(message: string): void {
        // no-op
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public warn(message: string): void {
        // no-op
    }    
}

export class CommandLogger implements Logger {
    private command: Command;
    private verbose: boolean;

    constructor(command: Command, verbose: boolean) {
        this.command = command;
        this.verbose = verbose;
    }

    debug(message: string): void {
        this.verbose && this.command.log(message);
    }

    error(message: string): void {
        this.command.error(message);
    }
    
    info(message: string): void {
        this.command.log(message);
    }

    warn(message: string): void {
        this.command.warn(message);
    }
}

