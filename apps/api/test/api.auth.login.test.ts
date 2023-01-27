import { describe, expect, test, vi } from "vitest";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { HttpMethod } from "aws-cdk-lib/aws-lambda";
import prisma from "../lib/__mocks__/prisma";
import authService from "../lib/__mocks__/auth";

vi.mock("../lib/prisma");
vi.mock("../lib/auth");

import { handler } from "../lib/api.auth.login";
import { createContext, createEvent } from "./mock";
import { UserInfo } from "../lib/auth";
import { User } from "@prisma/client";

describe("auth", () => {
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
        const response = await handler(event, context, () => {});
        const user = response as UserInfo;
        expect(user.email).toBe("admin@sunodo.io");
        expect(user.name).toBe("Sunodo Administrator");
    });

    test("unexisting sub, existing user", async () => {
        // at first can't find user with the token sub
        prisma.user.findFirst.mockResolvedValueOnce(null);

        // mock resolution of id token from access token (done by identity provider)
        authService.getUserInfo.mockResolvedValue({
            email: "admin@sunodo.io",
            name: "Sunodo Administrator",
        });

        // but the user (by email) exists, possibly from different sub
        prisma.user.findUnique.mockResolvedValueOnce({
            id: "1",
            email: "admin@sunodo.io",
            name: "Sunodo Administrator",
            createdAt: new Date(),
            subs: ["github|1234567890"],
        });

        prisma.user.update.mockResolvedValue({
            id: "1",
            email: "admin@sunodo.io",
            name: "Sunodo Administrator",
            createdAt: new Date(),
            subs: ["github|1234567890", "google-oauth2|1234567890"],
        });

        const event = createEvent({
            sub: "google-oauth2|1234567890",
            method: HttpMethod.GET,
            path: "/me",
            body: "",
        });
        const context = createContext("auth.login");
        const response = await handler(event, context, () => {});
        const user = response as User;
        expect(user.email).toBe("admin@sunodo.io");
        expect(user.subs).contains("github|1234567890");
        expect(user.subs).contains("google-oauth2|1234567890");
    });
});
