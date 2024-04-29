import { SendBaseCommand } from "./index.js";

export default class SendAddress extends SendBaseCommand<typeof SendAddress> {
    static summary = "Send DApp address input to the application.";

    static description =
        "Sends an input to the application with its own address.";

    static examples = ["<%= config.bin %> <%= command.id %>"];
}
