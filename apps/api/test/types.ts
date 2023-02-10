import { Plan, PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { BillingManager } from "../src/billing";
import { FastifyTypebox } from "../src/types";

export interface FastifyContext {
    prisma: PrismaClient;
    server: FastifyTypebox;
    stripe: Stripe;
    billing: BillingManager;
    plan: Plan;
}
