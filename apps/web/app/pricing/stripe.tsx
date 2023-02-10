"use client";
import { FC } from "react";

export const StripePricingTable: FC<{
    pricingTableId?: string;
    publishableKey?: string;
    clientReferenceId?: string;
    customerEmail?: string;
}> = ({ pricingTableId, publishableKey, clientReferenceId, customerEmail }) => {
    if (!pricingTableId || !publishableKey) return null;
    return (
        <stripe-pricing-table
            pricing-table-id={pricingTableId}
            publishable-key={publishableKey}
            client-reference-id={clientReferenceId}
            customer-email={customerEmail}
        />
    );
};
