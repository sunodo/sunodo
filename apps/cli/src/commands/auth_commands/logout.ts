import netrc from "netrc-parser";
import colors from "colors";
colors.enable();

export const handler = async () => {
    await netrc.load();
    if (!netrc.machines["api.sunodo.io"]) {
        console.error(`not logged in`.yellow);
        return;
    }

    const login = netrc.machines["api.sunodo.io"].login;

    // delete information from netrc
    delete netrc.machines["api.sunodo.io"];
    await netrc.save();

    console.log(`logged out '${login}'`.gray);
};
