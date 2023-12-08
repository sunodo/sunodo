import { describe, expect, test } from "vitest";
import { downloadMachine } from "../src/download.js";

describe("download", () => {
    test("should fail with invalid protocol", () => {
        expect(() =>
            downloadMachine("invalid://path", "__tests__/.trash"),
        ).toThrowError("invalid protocol");
    });
});
