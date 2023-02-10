import { PrismaClient } from "@prisma/client";
import { FastifyTypebox } from "../src/types";

export interface FastifyContext {
    prisma: PrismaClient;
    server: FastifyTypebox;
}
