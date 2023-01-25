import { describe, expect, test, vi } from "vitest";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { HttpMethod } from "aws-cdk-lib/aws-lambda";
import prisma from "../lib/__mocks__/prisma";

vi.mock("../lib/prisma");

import { handler, MeResponse } from "../lib/api.me";
import { createContext, createEvent } from "./mock";

describe("me", () => {
    test("existing user", async () => {
        prisma.user.findFirst.mockResolvedValue({
            id: "1",
            email: "admin@sunodo.io",
            name: "Sunodo Administrator",
            createdAt: new Date(),
            subs: ["google-oauth2|1234567890"],
        });

        const event = createEvent({
            sub: "google-oauth2|1234567890",
            method: HttpMethod.GET,
            path: "/me",
            body: "",
        });
        const context = createContext("me");
        const response = (await handler(
            event,
            context,
            () => {}
        )) as MeResponse;
        expect(response.email).toBe("admin@sunodo.io");
        expect(response.name).toBe("Sunodo Administrator");
    });

    test("unexisting user", async () => {
        prisma.user.findFirst.mockResolvedValue(null);
        const event = createEvent({
            sub: "google-oauth2|1234567890",
            method: HttpMethod.GET,
            path: "/me",
            body: "",
        });
        const context = createContext("me");
        const response = (await handler(
            event,
            context,
            () => {}
        )) as APIGatewayProxyStructuredResultV2;
        expect(response.statusCode).toBe(401);
    });
});
