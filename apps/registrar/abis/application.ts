export const applicationABI = [
    {
        type: "function",
        name: "executeOutput",
        inputs: [
            { name: "output", type: "bytes", internalType: "bytes" },
            {
                name: "proof",
                type: "tuple",
                internalType: "struct OutputValidityProof",
                components: [
                    {
                        name: "outputIndex",
                        type: "uint64",
                        internalType: "uint64",
                    },
                    {
                        name: "outputHashesSiblings",
                        type: "bytes32[]",
                        internalType: "bytes32[]",
                    },
                ],
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "getDataAvailability",
        inputs: [],
        outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getDeploymentBlockNumber",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getOutputsMerkleRootValidator",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "contract IOutputsMerkleRootValidator",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getTemplateHash",
        inputs: [],
        outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "migrateToOutputsMerkleRootValidator",
        inputs: [
            {
                name: "newOutputsMerkleRootValidator",
                type: "address",
                internalType: "contract IOutputsMerkleRootValidator",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [{ name: "", type: "address", internalType: "address" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "renounceOwnership",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "transferOwnership",
        inputs: [
            { name: "newOwner", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "validateOutput",
        inputs: [
            { name: "output", type: "bytes", internalType: "bytes" },
            {
                name: "proof",
                type: "tuple",
                internalType: "struct OutputValidityProof",
                components: [
                    {
                        name: "outputIndex",
                        type: "uint64",
                        internalType: "uint64",
                    },
                    {
                        name: "outputHashesSiblings",
                        type: "bytes32[]",
                        internalType: "bytes32[]",
                    },
                ],
            },
        ],
        outputs: [],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "validateOutputHash",
        inputs: [
            { name: "outputHash", type: "bytes32", internalType: "bytes32" },
            {
                name: "proof",
                type: "tuple",
                internalType: "struct OutputValidityProof",
                components: [
                    {
                        name: "outputIndex",
                        type: "uint64",
                        internalType: "uint64",
                    },
                    {
                        name: "outputHashesSiblings",
                        type: "bytes32[]",
                        internalType: "bytes32[]",
                    },
                ],
            },
        ],
        outputs: [],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "wasOutputExecuted",
        inputs: [
            { name: "outputIndex", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
    },
    {
        type: "event",
        name: "OutputExecuted",
        inputs: [
            {
                name: "outputIndex",
                type: "uint64",
                indexed: false,
                internalType: "uint64",
            },
            {
                name: "output",
                type: "bytes",
                indexed: false,
                internalType: "bytes",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "OutputsMerkleRootValidatorChanged",
        inputs: [
            {
                name: "newOutputsMerkleRootValidator",
                type: "address",
                indexed: false,
                internalType: "contract IOutputsMerkleRootValidator",
            },
        ],
        anonymous: false,
    },
    {
        type: "error",
        name: "InsufficientFunds",
        inputs: [
            { name: "value", type: "uint256", internalType: "uint256" },
            { name: "balance", type: "uint256", internalType: "uint256" },
        ],
    },
    {
        type: "error",
        name: "InvalidOutputHashesSiblingsArrayLength",
        inputs: [],
    },
    {
        type: "error",
        name: "InvalidOutputsMerkleRoot",
        inputs: [
            {
                name: "outputsMerkleRoot",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
    },
    {
        type: "error",
        name: "OutputNotExecutable",
        inputs: [{ name: "output", type: "bytes", internalType: "bytes" }],
    },
    {
        type: "error",
        name: "OutputNotReexecutable",
        inputs: [{ name: "output", type: "bytes", internalType: "bytes" }],
    },
] as const;
