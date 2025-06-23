export const financialProtocolABI = [
    {
        type: "event",
        name: "FinancialRunway",
        inputs: [
            {
                name: "application",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "until",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
        ],
        anonymous: false,
    },
] as const;
