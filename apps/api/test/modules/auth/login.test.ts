import { beforeEach, describe, expect, test, vi } from "vitest";
import { User } from "@prisma/client";

import prisma from "../../../src/utils/prisma";
import { authService } from "../../../src/modules/auth/__mocks__/auth.services";

vi.mock("../../../src/modules/auth/auth.services");

import buildServer from "../../../src/server";
import { UserInfo } from "../../../src/modules/auth/auth.services";
import { token } from "../../auth";

describe("login", () => {
    beforeEach(async () => {
        await prisma.$transaction([prisma.user.deleteMany()]);
    });

    test("existing user", async () => {
        await prisma.user.create({
            data: {
                email: "admin@sunodo.io",
                name: "Sunodo Administrator",
                createdAt: new Date(),
                subs: ["1234567890"],
            },
        });
        const server = buildServer();

        // just a fake token with the payload { "sub": "1234567890", "iat": 1516239022 }}
        // we need to pass fastify jwt preValidation, rest is mocked
        const response = await server.inject({
            method: "POST",
            url: "/auth/login",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(200);
        const user = JSON.parse(response.body) as UserInfo;
        expect(user.email).toBe("admin@sunodo.io");
        expect(user.name).toBe("Sunodo Administrator");
        await server.close();
    });

    test("unexisting sub, email not provided", async () => {
        const server = buildServer();

        // mock resolution of id token from access token (done by identity provider)
        authService.getUserInfo.mockResolvedValue({
            name: "Sunodo Administrator",
        });

        const response = await server.inject({
            method: "POST",
            url: "/auth/login",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(401);
    });

    test("unexisting sub, name not provided", async () => {
        const server = buildServer();

        // mock resolution of id token from access token (done by identity provider)
        authService.getUserInfo.mockResolvedValue({
            email: "admin@sunodo.io",
        });

        const response = await server.inject({
            method: "POST",
            url: "/auth/login",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(401);
    });

    test("unexisting sub, existing user", async () => {
        // but the user (by email) exists, possibly from different sub
        await prisma.user.create({
            data: {
                email: "admin@sunodo.io",
                name: "Sunodo Administrator",
                createdAt: new Date(),
                subs: ["github|1234567890"],
            },
        });

        const server = buildServer();

        // mock resolution of id token from access token (done by identity provider)
        authService.getUserInfo.mockResolvedValue({
            email: "admin@sunodo.io",
            name: "Sunodo Administrator",
        });

        const response = await server.inject({
            method: "POST",
            url: "/auth/login",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(200);
        const user = JSON.parse(response.body) as User;
        expect(user.email).toBe("admin@sunodo.io");
        expect(user.subs).contains("github|1234567890");
        expect(user.subs).contains("1234567890");
    });

    test("unexisting sub, create user", async () => {
        const server = buildServer();

        // mock resolution of id token from access token (done by identity provider)
        authService.getUserInfo.mockResolvedValue({
            email: "admin@sunodo.io",
            name: "Sunodo Administrator",
        });

        const response = await server.inject({
            method: "POST",
            url: "/auth/login",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toEqual(200);
        const user = JSON.parse(response.body) as User;
        expect(user.email).toBe("admin@sunodo.io");
        expect(user.subs).contains("1234567890");
    });
});
