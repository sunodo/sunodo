import Stripe from "stripe";
import { CustomerCreateParams, StripeBillingManager } from "../src/billing";

export class TestStripeBillingManager extends StripeBillingManager {
    private customers: string[];

    constructor(stripe: Stripe) {
        super(stripe);
        this.customers = [];
    }

    async createCustomer(params: CustomerCreateParams): Promise<string> {
        const id = await super.createCustomer(params);
        // keep track of created customer, so we can delete them in the end
        this.customers.push(id);
        return id;
    }

    async teardown() {
        // delete all created customers
        await Promise.all(
            this.customers.map((id) => this.stripe.customers.del(id))
        );
    }
}
