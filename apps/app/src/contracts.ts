//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Authority
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const authorityABI = [
    {
        stateMutability: "nonpayable",
        type: "constructor",
        inputs: [{ name: "_owner", internalType: "address", type: "address" }],
    },
    { type: "error", inputs: [], name: "AuthorityWithdrawalFailed" },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "application",
                internalType: "address",
                type: "address",
                indexed: false,
            },
        ],
        name: "ApplicationJoined",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "history",
                internalType: "contract IHistory",
                type: "address",
                indexed: false,
            },
        ],
        name: "NewHistory",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "previousOwner",
                internalType: "address",
                type: "address",
                indexed: true,
            },
            {
                name: "newOwner",
                internalType: "address",
                type: "address",
                indexed: true,
            },
        ],
        name: "OwnershipTransferred",
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "_dapp", internalType: "address", type: "address" },
            { name: "_proofContext", internalType: "bytes", type: "bytes" },
        ],
        name: "getClaim",
        outputs: [
            { name: "", internalType: "bytes32", type: "bytes32" },
            { name: "", internalType: "uint256", type: "uint256" },
            { name: "", internalType: "uint256", type: "uint256" },
        ],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "getHistory",
        outputs: [
            { name: "", internalType: "contract IHistory", type: "address" },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [],
        name: "join",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_consensus", internalType: "address", type: "address" },
        ],
        name: "migrateHistoryToConsensus",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "owner",
        outputs: [{ name: "", internalType: "address", type: "address" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_history",
                internalType: "contract IHistory",
                type: "address",
            },
        ],
        name: "setHistory",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [{ name: "_claimData", internalType: "bytes", type: "bytes" }],
        name: "submitClaim",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "newOwner", internalType: "address", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_token",
                internalType: "contract IERC20",
                type: "address",
            },
            { name: "_recipient", internalType: "address", type: "address" },
            { name: "_amount", internalType: "uint256", type: "uint256" },
        ],
        name: "withdrawERC20Tokens",
        outputs: [],
    },
] as const;

export const authorityAddress =
    "0x595E0864Ae328CC442068758eeceFb8B5d697a64" as const;

export const authorityConfig = {
    address: authorityAddress,
    abi: authorityABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AuthorityFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const authorityFactoryABI = [
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "authority",
                internalType: "contract Authority",
                type: "address",
                indexed: false,
            },
        ],
        name: "AuthorityCreated",
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            {
                name: "_authorityOwner",
                internalType: "address",
                type: "address",
            },
            { name: "_salt", internalType: "bytes32", type: "bytes32" },
        ],
        name: "calculateAuthorityAddress",
        outputs: [{ name: "", internalType: "address", type: "address" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [],
        name: "newAuthority",
        outputs: [
            { name: "", internalType: "contract Authority", type: "address" },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [{ name: "_salt", internalType: "bytes32", type: "bytes32" }],
        name: "newAuthority",
        outputs: [
            { name: "", internalType: "contract Authority", type: "address" },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_authorityOwner",
                internalType: "address",
                type: "address",
            },
            { name: "_salt", internalType: "bytes32", type: "bytes32" },
        ],
        name: "newAuthority",
        outputs: [
            { name: "", internalType: "contract Authority", type: "address" },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_authorityOwner",
                internalType: "address",
                type: "address",
            },
        ],
        name: "newAuthority",
        outputs: [
            { name: "", internalType: "contract Authority", type: "address" },
        ],
    },
] as const;

export const authorityFactoryAddress =
    "0x519421Bd7843e0D1E2F280490962850e31c86087" as const;

export const authorityFactoryConfig = {
    address: authorityFactoryAddress,
    abi: authorityFactoryABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Bitmask
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bitmaskABI = [] as const;

export const bitmaskAddress =
    "0xF5B2d8c81cDE4D6238bBf20D3D77DB37df13f735" as const;

export const bitmaskConfig = {
    address: bitmaskAddress,
    abi: bitmaskABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CartesiDAppFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const cartesiDAppFactoryABI = [
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "consensus",
                internalType: "contract IConsensus",
                type: "address",
                indexed: true,
            },
            {
                name: "dappOwner",
                internalType: "address",
                type: "address",
                indexed: false,
            },
            {
                name: "templateHash",
                internalType: "bytes32",
                type: "bytes32",
                indexed: false,
            },
            {
                name: "application",
                internalType: "contract CartesiDApp",
                type: "address",
                indexed: false,
            },
        ],
        name: "ApplicationCreated",
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            {
                name: "_consensus",
                internalType: "contract IConsensus",
                type: "address",
            },
            { name: "_dappOwner", internalType: "address", type: "address" },
            { name: "_templateHash", internalType: "bytes32", type: "bytes32" },
            { name: "_salt", internalType: "bytes32", type: "bytes32" },
        ],
        name: "calculateApplicationAddress",
        outputs: [{ name: "", internalType: "address", type: "address" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_consensus",
                internalType: "contract IConsensus",
                type: "address",
            },
            { name: "_dappOwner", internalType: "address", type: "address" },
            { name: "_templateHash", internalType: "bytes32", type: "bytes32" },
            { name: "_salt", internalType: "bytes32", type: "bytes32" },
        ],
        name: "newApplication",
        outputs: [
            { name: "", internalType: "contract CartesiDApp", type: "address" },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_consensus",
                internalType: "contract IConsensus",
                type: "address",
            },
            { name: "_dappOwner", internalType: "address", type: "address" },
            { name: "_templateHash", internalType: "bytes32", type: "bytes32" },
        ],
        name: "newApplication",
        outputs: [
            { name: "", internalType: "contract CartesiDApp", type: "address" },
        ],
    },
] as const;

export const cartesiDAppFactoryAddress =
    "0x7122cd1221C20892234186facfE8615e6743Ab02" as const;

export const cartesiDAppFactoryConfig = {
    address: cartesiDAppFactoryAddress,
    abi: cartesiDAppFactoryABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CartesiMathV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const cartesiMathV2ABI = [
    {
        stateMutability: "pure",
        type: "function",
        inputs: [{ name: "_num", internalType: "uint256", type: "uint256" }],
        name: "clz",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "pure",
        type: "function",
        inputs: [{ name: "_num", internalType: "uint256", type: "uint256" }],
        name: "ctz",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "pure",
        type: "function",
        inputs: [{ name: "_num", internalType: "uint256", type: "uint256" }],
        name: "getLog2Floor",
        outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    },
    {
        stateMutability: "pure",
        type: "function",
        inputs: [{ name: "_num", internalType: "uint256", type: "uint256" }],
        name: "getLog2TableTimes1M",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "pure",
        type: "function",
        inputs: [{ name: "_num", internalType: "uint256", type: "uint256" }],
        name: "isPowerOf2",
        outputs: [{ name: "", internalType: "bool", type: "bool" }],
    },
    {
        stateMutability: "pure",
        type: "function",
        inputs: [{ name: "_num", internalType: "uint256", type: "uint256" }],
        name: "log2ApproxTimes1M",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
] as const;

export const cartesiMathV2Address =
    "0xB634F716BEd5Dd5A2b9a91C92474C499e50Cb27D" as const;

export const cartesiMathV2Config = {
    address: cartesiMathV2Address,
    abi: cartesiMathV2ABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DAppAddressRelay
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dAppAddressRelayABI = [
    {
        stateMutability: "nonpayable",
        type: "constructor",
        inputs: [
            {
                name: "_inputBox",
                internalType: "contract IInputBox",
                type: "address",
            },
        ],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "getInputBox",
        outputs: [
            { name: "", internalType: "contract IInputBox", type: "address" },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [{ name: "_dapp", internalType: "address", type: "address" }],
        name: "relayDAppAddress",
        outputs: [],
    },
] as const;

export const dAppAddressRelayAddress =
    "0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE" as const;

export const dAppAddressRelayConfig = {
    address: dAppAddressRelayAddress,
    abi: dAppAddressRelayABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC1155BatchPortal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1155BatchPortalABI = [
    {
        stateMutability: "nonpayable",
        type: "constructor",
        inputs: [
            {
                name: "_inputBox",
                internalType: "contract IInputBox",
                type: "address",
            },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_token",
                internalType: "contract IERC1155",
                type: "address",
            },
            { name: "_dapp", internalType: "address", type: "address" },
            { name: "_tokenIds", internalType: "uint256[]", type: "uint256[]" },
            { name: "_values", internalType: "uint256[]", type: "uint256[]" },
            { name: "_baseLayerData", internalType: "bytes", type: "bytes" },
            { name: "_execLayerData", internalType: "bytes", type: "bytes" },
        ],
        name: "depositBatchERC1155Token",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "getInputBox",
        outputs: [
            { name: "", internalType: "contract IInputBox", type: "address" },
        ],
    },
] as const;

export const erc1155BatchPortalAddress =
    "0xedB53860A6B52bbb7561Ad596416ee9965B055Aa" as const;

export const erc1155BatchPortalConfig = {
    address: erc1155BatchPortalAddress,
    abi: erc1155BatchPortalABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC1155SinglePortal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1155SinglePortalABI = [
    {
        stateMutability: "nonpayable",
        type: "constructor",
        inputs: [
            {
                name: "_inputBox",
                internalType: "contract IInputBox",
                type: "address",
            },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_token",
                internalType: "contract IERC1155",
                type: "address",
            },
            { name: "_dapp", internalType: "address", type: "address" },
            { name: "_tokenId", internalType: "uint256", type: "uint256" },
            { name: "_value", internalType: "uint256", type: "uint256" },
            { name: "_baseLayerData", internalType: "bytes", type: "bytes" },
            { name: "_execLayerData", internalType: "bytes", type: "bytes" },
        ],
        name: "depositSingleERC1155Token",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "getInputBox",
        outputs: [
            { name: "", internalType: "contract IInputBox", type: "address" },
        ],
    },
] as const;

export const erc1155SinglePortalAddress =
    "0x7CFB0193Ca87eB6e48056885E026552c3A941FC4" as const;

export const erc1155SinglePortalConfig = {
    address: erc1155SinglePortalAddress,
    abi: erc1155SinglePortalABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20ABI = [
    {
        type: "event",
        inputs: [
            { name: "owner", type: "address", indexed: true },
            { name: "spender", type: "address", indexed: true },
            { name: "value", type: "uint256", indexed: false },
        ],
        name: "Approval",
    },
    {
        type: "event",
        inputs: [
            { name: "from", type: "address", indexed: true },
            { name: "to", type: "address", indexed: true },
            { name: "value", type: "uint256", indexed: false },
        ],
        name: "Transfer",
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ type: "uint256" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ type: "bool" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ type: "uint256" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "decimals",
        outputs: [{ type: "uint8" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "name",
        outputs: [{ type: "string" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "symbol",
        outputs: [{ type: "string" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "totalSupply",
        outputs: [{ type: "uint256" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "recipient", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ type: "bool" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "sender", type: "address" },
            { name: "recipient", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ type: "bool" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "spender", type: "address" },
            { name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ type: "bool" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "spender", type: "address" },
            { name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ type: "bool" }],
    },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20Portal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20PortalABI = [
    {
        stateMutability: "nonpayable",
        type: "constructor",
        inputs: [
            {
                name: "_inputBox",
                internalType: "contract IInputBox",
                type: "address",
            },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_token",
                internalType: "contract IERC20",
                type: "address",
            },
            { name: "_dapp", internalType: "address", type: "address" },
            { name: "_amount", internalType: "uint256", type: "uint256" },
            { name: "_execLayerData", internalType: "bytes", type: "bytes" },
        ],
        name: "depositERC20Tokens",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "getInputBox",
        outputs: [
            { name: "", internalType: "contract IInputBox", type: "address" },
        ],
    },
] as const;

export const erc20PortalAddress =
    "0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB" as const;

export const erc20PortalConfig = {
    address: erc20PortalAddress,
    abi: erc20PortalABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC721
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc721ABI = [
    {
        type: "event",
        inputs: [
            { name: "owner", type: "address", indexed: true },
            { name: "spender", type: "address", indexed: true },
            { name: "tokenId", type: "uint256", indexed: true },
        ],
        name: "Approval",
    },
    {
        type: "event",
        inputs: [
            { name: "owner", type: "address", indexed: true },
            { name: "operator", type: "address", indexed: true },
            { name: "approved", type: "bool", indexed: false },
        ],
        name: "ApprovalForAll",
    },
    {
        type: "event",
        inputs: [
            { name: "from", type: "address", indexed: true },
            { name: "to", type: "address", indexed: true },
            { name: "tokenId", type: "uint256", indexed: true },
        ],
        name: "Transfer",
    },
    {
        stateMutability: "payable",
        type: "function",
        inputs: [
            { name: "spender", type: "address" },
            { name: "tokenId", type: "uint256" },
        ],
        name: "approve",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ type: "uint256" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "getApproved",
        outputs: [{ type: "address" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "owner", type: "address" },
            { name: "operator", type: "address" },
        ],
        name: "isApprovedForAll",
        outputs: [{ type: "bool" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "name",
        outputs: [{ type: "string" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "ownerOf",
        outputs: [{ name: "owner", type: "address" }],
    },
    {
        stateMutability: "payable",
        type: "function",
        inputs: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "tokenId", type: "uint256" },
        ],
        name: "safeTransferFrom",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "id", type: "uint256" },
            { name: "data", type: "bytes" },
        ],
        name: "safeTransferFrom",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "operator", type: "address" },
            { name: "approved", type: "bool" },
        ],
        name: "setApprovalForAll",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "symbol",
        outputs: [{ type: "string" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "index", type: "uint256" }],
        name: "tokenByIndex",
        outputs: [{ type: "uint256" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "owner", type: "address" },
            { name: "index", type: "uint256" },
        ],
        name: "tokenByIndex",
        outputs: [{ name: "tokenId", type: "uint256" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ type: "string" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "totalSupply",
        outputs: [{ type: "uint256" }],
    },
    {
        stateMutability: "payable",
        type: "function",
        inputs: [
            { name: "sender", type: "address" },
            { name: "recipient", type: "address" },
            { name: "tokenId", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [],
    },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC721Portal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc721PortalABI = [
    {
        stateMutability: "nonpayable",
        type: "constructor",
        inputs: [
            {
                name: "_inputBox",
                internalType: "contract IInputBox",
                type: "address",
            },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_token",
                internalType: "contract IERC721",
                type: "address",
            },
            { name: "_dapp", internalType: "address", type: "address" },
            { name: "_tokenId", internalType: "uint256", type: "uint256" },
            { name: "_baseLayerData", internalType: "bytes", type: "bytes" },
            { name: "_execLayerData", internalType: "bytes", type: "bytes" },
        ],
        name: "depositERC721Token",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "getInputBox",
        outputs: [
            { name: "", internalType: "contract IInputBox", type: "address" },
        ],
    },
] as const;

export const erc721PortalAddress =
    "0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87" as const;

export const erc721PortalConfig = {
    address: erc721PortalAddress,
    abi: erc721PortalABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EtherPortal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const etherPortalABI = [
    {
        stateMutability: "nonpayable",
        type: "constructor",
        inputs: [
            {
                name: "_inputBox",
                internalType: "contract IInputBox",
                type: "address",
            },
        ],
    },
    { type: "error", inputs: [], name: "EtherTransferFailed" },
    {
        stateMutability: "payable",
        type: "function",
        inputs: [
            { name: "_dapp", internalType: "address", type: "address" },
            { name: "_execLayerData", internalType: "bytes", type: "bytes" },
        ],
        name: "depositEther",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "getInputBox",
        outputs: [
            { name: "", internalType: "contract IInputBox", type: "address" },
        ],
    },
] as const;

export const etherPortalAddress =
    "0xFfdbe43d4c855BF7e0f105c400A50857f53AB044" as const;

export const etherPortalConfig = {
    address: etherPortalAddress,
    abi: etherPortalABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// History
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const historyABI = [
    {
        stateMutability: "nonpayable",
        type: "constructor",
        inputs: [{ name: "_owner", internalType: "address", type: "address" }],
    },
    { type: "error", inputs: [], name: "InvalidClaimIndex" },
    { type: "error", inputs: [], name: "InvalidInputIndices" },
    { type: "error", inputs: [], name: "UnclaimedInputs" },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "dapp",
                internalType: "address",
                type: "address",
                indexed: true,
            },
            {
                name: "claim",
                internalType: "struct History.Claim",
                type: "tuple",
                components: [
                    {
                        name: "epochHash",
                        internalType: "bytes32",
                        type: "bytes32",
                    },
                    {
                        name: "firstIndex",
                        internalType: "uint128",
                        type: "uint128",
                    },
                    {
                        name: "lastIndex",
                        internalType: "uint128",
                        type: "uint128",
                    },
                ],
                indexed: false,
            },
        ],
        name: "NewClaimToHistory",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "previousOwner",
                internalType: "address",
                type: "address",
                indexed: true,
            },
            {
                name: "newOwner",
                internalType: "address",
                type: "address",
                indexed: true,
            },
        ],
        name: "OwnershipTransferred",
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "_dapp", internalType: "address", type: "address" },
            { name: "_proofContext", internalType: "bytes", type: "bytes" },
        ],
        name: "getClaim",
        outputs: [
            { name: "", internalType: "bytes32", type: "bytes32" },
            { name: "", internalType: "uint256", type: "uint256" },
            { name: "", internalType: "uint256", type: "uint256" },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_consensus", internalType: "address", type: "address" },
        ],
        name: "migrateToConsensus",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "owner",
        outputs: [{ name: "", internalType: "address", type: "address" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [{ name: "_claimData", internalType: "bytes", type: "bytes" }],
        name: "submitClaim",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "newOwner", internalType: "address", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
    },
] as const;

export const historyAddress =
    "0x55a62B15719119725d0e8763F69c1d17c7946673" as const;

export const historyConfig = {
    address: historyAddress,
    abi: historyABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IFinancialProtocol
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iFinancialProtocolABI = [
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "dapp",
                internalType: "address",
                type: "address",
                indexed: true,
            },
            {
                name: "until",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
        ],
        name: "FinancialRunway",
    },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IMachineProtocol
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iMachineProtocolABI = [
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "dapp",
                internalType: "address",
                type: "address",
                indexed: true,
            },
            {
                name: "location",
                internalType: "string",
                type: "string",
                indexed: false,
            },
        ],
        name: "MachineLocation",
    },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IPayableDAppFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iPayableDAppFactoryABI = [
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "consensus",
        outputs: [
            { name: "", internalType: "contract IConsensus", type: "address" },
        ],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "_time", internalType: "uint256", type: "uint256" }],
        name: "cost",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_dapp",
                internalType: "contract ICartesiDApp",
                type: "address",
            },
            { name: "_time", internalType: "uint256", type: "uint256" },
        ],
        name: "extendRunway",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_dapp",
                internalType: "contract CartesiDApp",
                type: "address",
            },
            { name: "_cid", internalType: "string", type: "string" },
            { name: "_runway", internalType: "uint256", type: "uint256" },
        ],
        name: "importApplication",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_dappOwner", internalType: "address", type: "address" },
            { name: "_templateHash", internalType: "bytes32", type: "bytes32" },
            { name: "_cid", internalType: "string", type: "string" },
            { name: "_runway", internalType: "uint256", type: "uint256" },
        ],
        name: "newApplication",
        outputs: [
            { name: "", internalType: "contract CartesiDApp", type: "address" },
        ],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "payee",
        outputs: [{ name: "", internalType: "address", type: "address" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            {
                name: "_dapp",
                internalType: "contract ICartesiDApp",
                type: "address",
            },
        ],
        name: "runway",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [{ name: "_name", internalType: "string", type: "string" }],
        name: "setName",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "token",
        outputs: [
            { name: "", internalType: "contract IERC20", type: "address" },
        ],
    },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// InputBox
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const inputBoxABI = [
    { type: "error", inputs: [], name: "InputSizeExceedsLimit" },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "dapp",
                internalType: "address",
                type: "address",
                indexed: true,
            },
            {
                name: "inputIndex",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "sender",
                internalType: "address",
                type: "address",
                indexed: false,
            },
            {
                name: "input",
                internalType: "bytes",
                type: "bytes",
                indexed: false,
            },
        ],
        name: "InputAdded",
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_dapp", internalType: "address", type: "address" },
            { name: "_input", internalType: "bytes", type: "bytes" },
        ],
        name: "addInput",
        outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "_dapp", internalType: "address", type: "address" },
            { name: "_index", internalType: "uint256", type: "uint256" },
        ],
        name: "getInputHash",
        outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "_dapp", internalType: "address", type: "address" }],
        name: "getNumberOfInputs",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
] as const;

export const inputBoxAddress =
    "0x59b22D57D4f067708AB0c00552767405926dc768" as const;

export const inputBoxConfig = {
    address: inputBoxAddress,
    abi: inputBoxABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MerkleV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const merkleV2ABI = [
    {
        stateMutability: "pure",
        type: "function",
        inputs: [
            { name: "hashes", internalType: "bytes32[]", type: "bytes32[]" },
        ],
        name: "calculateRootFromPowerOfTwo",
        outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    },
    {
        stateMutability: "pure",
        type: "function",
        inputs: [{ name: "_index", internalType: "uint256", type: "uint256" }],
        name: "getEmptyTreeHashAtIndex",
        outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    },
    {
        stateMutability: "pure",
        type: "function",
        inputs: [
            { name: "_data", internalType: "bytes", type: "bytes" },
            { name: "_wordIndex", internalType: "uint256", type: "uint256" },
        ],
        name: "getHashOfWordAtIndex",
        outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    },
    {
        stateMutability: "pure",
        type: "function",
        inputs: [
            { name: "_data", internalType: "bytes", type: "bytes" },
            { name: "_log2Size", internalType: "uint256", type: "uint256" },
        ],
        name: "getMerkleRootFromBytes",
        outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    },
    {
        stateMutability: "pure",
        type: "function",
        inputs: [
            { name: "_position", internalType: "uint256", type: "uint256" },
            {
                name: "_logSizeOfReplacement",
                internalType: "uint256",
                type: "uint256",
            },
            {
                name: "_logSizeOfFullDrive",
                internalType: "uint256",
                type: "uint256",
            },
            { name: "_replacement", internalType: "bytes32", type: "bytes32" },
            { name: "siblings", internalType: "bytes32[]", type: "bytes32[]" },
        ],
        name: "getRootAfterReplacementInDrive",
        outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    },
] as const;

export const merkleV2Address =
    "0x33436035441927Df1a73FE3AAC5906854632e53d" as const;

export const merkleV2Config = {
    address: merkleV2Address,
    abi: merkleV2ABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PayableDAppSystem
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const payableDAppSystemABI = [
    {
        stateMutability: "nonpayable",
        type: "constructor",
        inputs: [
            {
                name: "_factory",
                internalType: "contract ICartesiDAppFactory",
                type: "address",
            },
        ],
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "factory",
                internalType: "contract IPayableDAppFactory",
                type: "address",
                indexed: false,
            },
            {
                name: "token",
                internalType: "contract IERC20",
                type: "address",
                indexed: false,
            },
            {
                name: "consensus",
                internalType: "contract IConsensus",
                type: "address",
                indexed: false,
            },
            {
                name: "price",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
        ],
        name: "PayableDAppFactoryCreated",
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "factory",
        outputs: [
            {
                name: "",
                internalType: "contract ICartesiDAppFactory",
                type: "address",
            },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_token",
                internalType: "contract IERC20",
                type: "address",
            },
            {
                name: "_consensus",
                internalType: "contract IConsensus",
                type: "address",
            },
            { name: "_price", internalType: "uint256", type: "uint256" },
        ],
        name: "newPayableDAppFactory",
        outputs: [
            {
                name: "",
                internalType: "contract IPayableDAppFactory",
                type: "address",
            },
        ],
    },
] as const;

export const payableDAppSystemAddress =
    "0xEBc7b046e7781cCBF75A4Aa32A40eB3932c1813E" as const;

export const payableDAppSystemConfig = {
    address: payableDAppSystemAddress,
    abi: payableDAppSystemABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UnrolledCordic
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const unrolledCordicABI = [
    {
        stateMutability: "pure",
        type: "function",
        inputs: [{ name: "val", internalType: "uint256", type: "uint256" }],
        name: "log2Times1e18",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
] as const;

export const unrolledCordicAddress =
    "0x3F8FdcD1B0F421D817BF58C96b7C91B98100B450" as const;

export const unrolledCordicConfig = {
    address: unrolledCordicAddress,
    abi: unrolledCordicABI,
} as const;
