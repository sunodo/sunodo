import { SendBaseCommand } from "./index.js";

export default class SendGeneric extends SendBaseCommand<typeof SendGeneric> {
    static summary = "Send generic input to the application.";

    static description =
        "Sends generics inputs to the application, optionally in interactive mode.";

    static examples = ["<%= config.bin %> <%= command.id %>"];
}
