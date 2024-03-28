import Table from "cli-table3";
import { Command } from "clipanion";

import { SunodoCommand } from "../sunodoCommand.js";

export default class AddressBook extends SunodoCommand {
    static paths = [["address-book"]];

    static usage = Command.Usage({
        description: "Prints addresses of smart contracts deployed.",
        details:
            "Prints the addresses of all smart contracts deployed to the runtime environment of the application.",
    });

    public async execute(): Promise<void> {
        const addressBook = await super.getAddressBook();
        if (!this.jsonEnabled) {
            // print as a table
            const table = new Table({
                head: ["Contract", "Address"],
                style: { compact: true, head: ["cyan"] },
            });
            table.push(...Object.entries(addressBook));
            this.context.stdout.write(`${table.toString()}\n`);
        } else {
            // print json
            this.context.stdout.write(JSON.stringify(addressBook));
        }
    }
}
