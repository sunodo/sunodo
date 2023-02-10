"use client";
import { FC } from "react";

export const StripePricingTable: FC<{
    pricingTableId?: string;
    publishableKey?: string;
    clientReferenceId?: string;
}> = ({ pricingTableId, publishableKey, clientReferenceId }) => {
    if (!pricingTableId || !publishableKey) return null;
    return (
        <stripe-pricing-table
            pricing-table-id={pricingTableId}
            publishable-key={publishableKey}
            client-reference-id={clientReferenceId}
        />
    );
};
