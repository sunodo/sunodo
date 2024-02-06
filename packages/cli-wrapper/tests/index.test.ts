import { CLIWrapper } from "../src/index";

describe("testing cli wrapper", () => {
    test("should fail withoud a command", () => {
        let cli = new CLIWrapper();
        try {
            cli.build();
        } catch (e: any) {
            expect(e.message).toBe("Command not set");
        }
    });

    test("should fail with subdommand not set", () => {
        let cli = new CLIWrapper();
        try {
            cli.withCmd("cmd")
                .withArgs(["--some-arg"])
                .withCmd("subcmd")
                .withArgs(["--some-arg"]);
            cli.build();
        } catch (e: any) {
            expect(e.message).toBe("Command already set");
        }
    });

    test("should succeed with subdommand set", () => {
        let cli = new CLIWrapper();
        cli.allowSubCommand = true;
        cli.withCmd("cmd")
            .withArgs(["--cmd-arg"])
            .withCmd("subcmd")
            .withArgs(["--subcmd-arg"]);
        expect(cli.build()).toBe("cmd --cmd-arg subcmd --subcmd-arg");
    });
});
