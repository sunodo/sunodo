import netrc from "netrc-parser";
import colors from "colors";
colors.enable();

export const handler = async () => {
    await netrc.load();
    if (netrc.machines["api.sunodo.io"]) {
        console.log(
            `logged in as '${netrc.machines["api.sunodo.io"].login}'`.gray
        );
    } else {
        console.log("not logged in".yellow);
    }
};
