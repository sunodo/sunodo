import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Account, Plan } from "@prisma/client";
import { FastifyPluginOptions } from "fastify";
import Stripe from "stripe";
import fp from "fastify-plugin";
import { FastifyTypebox } from "./types";

export type CustomerCreateParams = {
    email?: string;
    name?: string;
    description?: string;
    metadata?: Record<string, string>;
};

export type CheckoutParams = {
    email?: string;
    account: Account & { plan: Plan };
};

export interface BillingManager {
    /**
     * Creates
     * @param params customer information
     */
    createCustomer(params: CustomerCreateParams): Promise<string>;
    createCheckoutUrl(params: CheckoutParams): Promise<string | null>;
}

export class StripeBillingManager implements BillingManager {
    protected stripe: Stripe;

    constructor(stripe: Stripe) {
        this.stripe = stripe;
    }

    async createCustomer(params: CustomerCreateParams): Promise<string> {
        const customer = await this.stripe.customers.create({
            email: params.email,
            description: params.description,
            name: params.name,
            metadata: params.metadata,
        });
        return customer.id;
    }

    async createCheckoutUrl(params: CheckoutParams): Promise<string | null> {
        const session = await this.stripe.checkout.sessions.create({
            client_reference_id: params.account.id,
            customer_email: params.email,
            mode: "subscription",
            success_url: `${process.env.WEBSITE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            allow_promotion_codes: true,
            line_items: [{ price: params.account.plan.stripePriceId }],
        });
        return session.url;
    }
}

export type BillingPluginOptions = {
    billing: BillingManager;
} & FastifyPluginOptions;

const billingPlugin: FastifyPluginAsyncTypebox<BillingPluginOptions> = async (
    server: FastifyTypebox,
    options
) => {
    server.decorate<BillingManager>("billing", options.billing);
};

export default fp(billingPlugin);
