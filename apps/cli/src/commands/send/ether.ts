import { SendBaseCommand } from "./index.js";

export default class SendEther extends SendBaseCommand<typeof SendEther> {
    static summary = "Send ether deposit to the application.";

    static description =
        "Sends ether deposits to the application, optionally in interactive mode.";

    static flags = {};

    static examples = ["<%= config.bin %> <%= command.id %>"];
}
