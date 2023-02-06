import { expect, test } from "@oclif/test";

describe("auth:logout", () => {
    test.stdout()
        .command(["auth:logout"])
        .it("runs hello", (ctx) => {
            expect(ctx.stdout).to.contain("hello world");
        });

    test.stdout()
        .command(["auth:logout", "--name", "jeff"])
        .it("runs hello --name jeff", (ctx) => {
            expect(ctx.stdout).to.contain("hello jeff");
        });
});
