import { expect, test } from "@oclif/test";

describe("platform:chains", () => {
    test.stdout()
        .command(["platform:chains"])
        .it("runs hello", (ctx) => {
            expect(ctx.stdout).to.contain("hello world");
        });

    test.stdout()
        .command(["platform:chains", "--name", "jeff"])
        .it("runs hello --name jeff", (ctx) => {
            expect(ctx.stdout).to.contain("hello jeff");
        });
});
