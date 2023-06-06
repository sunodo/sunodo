import { ux } from "@oclif/core";

import {
    AddressBook as AddressBookType,
    SunodoCommand,
} from "../sunodoCommand.js";

export default class AddressBook extends SunodoCommand<typeof AddressBook> {
    static summary = "Prints addresses of smart contracts deployed.";

    static description =
        "Prints the addresses of all smart contracts deployed to the runtime environment of the application.";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    public static enableJsonFlag = true;

    public async run(): Promise<AddressBookType> {
        const addressBook = await super.getAddressBook();
        if (!this.jsonEnabled()) {
            // print as a table
            ux.table(
                Object.entries(addressBook).map(([name, address]) => ({
                    name,
                    address,
                })),
                { name: { header: "Contract" }, address: {} }
            );
        }
        // return (as json)
        return addressBook;
    }
}
