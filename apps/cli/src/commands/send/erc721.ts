import { SendBaseCommand } from "./index.js";

export default class SendERC721 extends SendBaseCommand<typeof SendERC721> {
    static summary = "Send ERC-721 deposit to the application.";

    static description =
        "Sends ERC-721 deposits to the application, optionally in interactive mode.";

    static examples = ["<%= config.bin %> <%= command.id %>"];
}
