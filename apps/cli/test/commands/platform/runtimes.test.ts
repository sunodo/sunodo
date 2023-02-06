import { expect, test } from "@oclif/test";

describe("platform:runtimes", () => {
    test.stdout()
        .command(["platform:runtimes"])
        .it("runs hello", (ctx) => {
            expect(ctx.stdout).to.contain("hello world");
        });

    test.stdout()
        .command(["platform:runtimes", "--name", "jeff"])
        .it("runs hello --name jeff", (ctx) => {
            expect(ctx.stdout).to.contain("hello jeff");
        });
});
