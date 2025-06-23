export const machineProtocolABI = [
    {
        type: "event",
        name: "MachineLocation",
        inputs: [
            {
                name: "application",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "location",
                type: "string",
                indexed: false,
                internalType: "string",
            },
        ],
        anonymous: false,
    },
] as const;
