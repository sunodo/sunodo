export const cartesiDAppFactoryAddress =
    "0x7122cd1221C20892234186facfE8615e6743Ab02";
export const authorityFactoryAddress =
    "0x519421Bd7843e0D1E2F280490962850e31c86087";
export const marketplaceAddress = "0xB7E1f205Aa8ad197D82CB8A49a0e1134bf750fcC";

// information about the deployment block of the contracts, so scan is optimized
export const blocks: Record<number, Record<string, number>> = {
    31337: { CartesiDAppFactory: 0, AuthorityFactory: 0, Marketplace: 0 },
    11155111: {
        CartesiDAppFactory: 3969278,
        AuthorityFactory: 3976538,
        Marketplace: 4058614,
    },
};
