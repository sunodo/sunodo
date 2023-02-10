"use client";
import { StripePricingTable } from "./stripe";

export default function Page() {
    // TODO: add clientReferentId from url query param
    return (
        <>
            <StripePricingTable
                clientReferenceId=""
                pricingTableId="prctbl_1MZzfdHytG4GeYTNMr4SBZPK"
                publishableKey="pk_test_51MRNifHytG4GeYTNJQmBo6bFeUVQSQUHcy97c5WmQUKHwrFkkUxAtSUVOB73oH0cS5bhQC211fNh9vsQbhpKcsuU00eqnE47Tx"
            />
        </>
    );
}
