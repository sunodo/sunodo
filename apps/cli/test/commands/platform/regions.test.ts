import { expect, test } from "@oclif/test";

describe("platform:regions", () => {
    test.stdout()
        .command(["platform:regions"])
        .it("runs hello", (ctx) => {
            expect(ctx.stdout).to.contain("hello world");
        });

    test.stdout()
        .command(["platform:regions", "--name", "jeff"])
        .it("runs hello --name jeff", (ctx) => {
            expect(ctx.stdout).to.contain("hello jeff");
        });
});
