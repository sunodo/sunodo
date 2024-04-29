import { SendBaseCommand } from "./index.js";

export default class SendERC20 extends SendBaseCommand<typeof SendERC20> {
    static summary = "Send ERC-20 deposit to the application.";

    static description =
        "Sends ERC-20 deposits to the application, optionally in interactive mode.";

    static examples = ["<%= config.bin %> <%= command.id %>"];
}
