import {
    createUseReadContract,
    createUseWriteContract,
    createUseSimulateContract,
    createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AuthorityFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const authorityFactoryAbi = [
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'authorityOwner',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
            {
                name: 'authority',
                internalType: 'contract Authority',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'AuthorityCreated',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_authorityOwner',
                internalType: 'address',
                type: 'address',
            },
            { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'calculateAuthorityAddress',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_authorityOwner',
                internalType: 'address',
                type: 'address',
            },
            { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'newAuthority',
        outputs: [
            { name: '', internalType: 'contract Authority', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_authorityOwner',
                internalType: 'address',
                type: 'address',
            },
        ],
        name: 'newAuthority',
        outputs: [
            { name: '', internalType: 'contract Authority', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
] as const

export const authorityFactoryAddress =
    '0xf26a5b278C25D8D41A136d22Ad719EACEd9c3e63' as const

export const authorityFactoryConfig = {
    address: authorityFactoryAddress,
    abi: authorityFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AuthorityHistoryPairFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const authorityHistoryPairFactoryAbi = [
    {
        type: 'constructor',
        inputs: [
            {
                name: '_authorityFactory',
                internalType: 'contract IAuthorityFactory',
                type: 'address',
            },
            {
                name: '_historyFactory',
                internalType: 'contract IHistoryFactory',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'authorityFactory',
                internalType: 'contract IAuthorityFactory',
                type: 'address',
                indexed: false,
            },
            {
                name: 'historyFactory',
                internalType: 'contract IHistoryFactory',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'AuthorityHistoryPairFactoryCreated',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_authorityOwner',
                internalType: 'address',
                type: 'address',
            },
            { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'calculateAuthorityHistoryAddressPair',
        outputs: [
            {
                name: 'authorityAddress_',
                internalType: 'address',
                type: 'address',
            },
            {
                name: 'historyAddress_',
                internalType: 'address',
                type: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'getAuthorityFactory',
        outputs: [
            {
                name: '',
                internalType: 'contract IAuthorityFactory',
                type: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'getHistoryFactory',
        outputs: [
            {
                name: '',
                internalType: 'contract IHistoryFactory',
                type: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_authorityOwner',
                internalType: 'address',
                type: 'address',
            },
        ],
        name: 'newAuthorityHistoryPair',
        outputs: [
            {
                name: 'authority_',
                internalType: 'contract Authority',
                type: 'address',
            },
            {
                name: 'history_',
                internalType: 'contract History',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_authorityOwner',
                internalType: 'address',
                type: 'address',
            },
            { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'newAuthorityHistoryPair',
        outputs: [
            {
                name: 'authority_',
                internalType: 'contract Authority',
                type: 'address',
            },
            {
                name: 'history_',
                internalType: 'contract History',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
] as const

export const authorityHistoryPairFactoryAddress =
    '0x3890A047Cf9Af60731E80B2105362BbDCD70142D' as const

export const authorityHistoryPairFactoryConfig = {
    address: authorityHistoryPairFactoryAddress,
    abi: authorityHistoryPairFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Bitmask
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bitmaskAbi = [] as const

export const bitmaskAddress =
    '0xF5B2d8c81cDE4D6238bBf20D3D77DB37df13f735' as const

export const bitmaskConfig = {
    address: bitmaskAddress,
    abi: bitmaskAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CartesiDAppFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const cartesiDAppFactoryAbi = [
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'consensus',
                internalType: 'contract IConsensus',
                type: 'address',
                indexed: true,
            },
            {
                name: 'dappOwner',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
            {
                name: 'templateHash',
                internalType: 'bytes32',
                type: 'bytes32',
                indexed: false,
            },
            {
                name: 'application',
                internalType: 'contract CartesiDApp',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'ApplicationCreated',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_consensus',
                internalType: 'contract IConsensus',
                type: 'address',
            },
            { name: '_dappOwner', internalType: 'address', type: 'address' },
            { name: '_templateHash', internalType: 'bytes32', type: 'bytes32' },
            { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'calculateApplicationAddress',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_consensus',
                internalType: 'contract IConsensus',
                type: 'address',
            },
            { name: '_dappOwner', internalType: 'address', type: 'address' },
            { name: '_templateHash', internalType: 'bytes32', type: 'bytes32' },
            { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'newApplication',
        outputs: [
            { name: '', internalType: 'contract CartesiDApp', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_consensus',
                internalType: 'contract IConsensus',
                type: 'address',
            },
            { name: '_dappOwner', internalType: 'address', type: 'address' },
            { name: '_templateHash', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'newApplication',
        outputs: [
            { name: '', internalType: 'contract CartesiDApp', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
] as const

export const cartesiDAppFactoryAddress =
    '0x7122cd1221C20892234186facfE8615e6743Ab02' as const

export const cartesiDAppFactoryConfig = {
    address: cartesiDAppFactoryAddress,
    abi: cartesiDAppFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CartesiMathV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const cartesiMathV2Abi = [
    {
        type: 'function',
        inputs: [{ name: '_num', internalType: 'uint256', type: 'uint256' }],
        name: 'clz',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [{ name: '_num', internalType: 'uint256', type: 'uint256' }],
        name: 'ctz',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [{ name: '_num', internalType: 'uint256', type: 'uint256' }],
        name: 'getLog2Floor',
        outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [{ name: '_num', internalType: 'uint256', type: 'uint256' }],
        name: 'getLog2TableTimes1M',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [{ name: '_num', internalType: 'uint256', type: 'uint256' }],
        name: 'isPowerOf2',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [{ name: '_num', internalType: 'uint256', type: 'uint256' }],
        name: 'log2ApproxTimes1M',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'pure',
    },
] as const

export const cartesiMathV2Address =
    '0xB634F716BEd5Dd5A2b9a91C92474C499e50Cb27D' as const

export const cartesiMathV2Config = {
    address: cartesiMathV2Address,
    abi: cartesiMathV2Abi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DAppAddressRelay
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dAppAddressRelayAbi = [
    {
        type: 'constructor',
        inputs: [
            {
                name: '_inputBox',
                internalType: 'contract IInputBox',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'getInputBox',
        outputs: [
            { name: '', internalType: 'contract IInputBox', type: 'address' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: '_dapp', internalType: 'address', type: 'address' }],
        name: 'relayDAppAddress',
        outputs: [],
        stateMutability: 'nonpayable',
    },
] as const

export const dAppAddressRelayAddress =
    '0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE' as const

export const dAppAddressRelayConfig = {
    address: dAppAddressRelayAddress,
    abi: dAppAddressRelayAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC1155BatchPortal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1155BatchPortalAbi = [
    {
        type: 'constructor',
        inputs: [
            {
                name: '_inputBox',
                internalType: 'contract IInputBox',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_token',
                internalType: 'contract IERC1155',
                type: 'address',
            },
            { name: '_dapp', internalType: 'address', type: 'address' },
            { name: '_tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
            { name: '_values', internalType: 'uint256[]', type: 'uint256[]' },
            { name: '_baseLayerData', internalType: 'bytes', type: 'bytes' },
            { name: '_execLayerData', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'depositBatchERC1155Token',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'getInputBox',
        outputs: [
            { name: '', internalType: 'contract IInputBox', type: 'address' },
        ],
        stateMutability: 'view',
    },
] as const

export const erc1155BatchPortalAddress =
    '0xedB53860A6B52bbb7561Ad596416ee9965B055Aa' as const

export const erc1155BatchPortalConfig = {
    address: erc1155BatchPortalAddress,
    abi: erc1155BatchPortalAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC1155SinglePortal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1155SinglePortalAbi = [
    {
        type: 'constructor',
        inputs: [
            {
                name: '_inputBox',
                internalType: 'contract IInputBox',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_token',
                internalType: 'contract IERC1155',
                type: 'address',
            },
            { name: '_dapp', internalType: 'address', type: 'address' },
            { name: '_tokenId', internalType: 'uint256', type: 'uint256' },
            { name: '_value', internalType: 'uint256', type: 'uint256' },
            { name: '_baseLayerData', internalType: 'bytes', type: 'bytes' },
            { name: '_execLayerData', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'depositSingleERC1155Token',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'getInputBox',
        outputs: [
            { name: '', internalType: 'contract IInputBox', type: 'address' },
        ],
        stateMutability: 'view',
    },
] as const

export const erc1155SinglePortalAddress =
    '0x7CFB0193Ca87eB6e48056885E026552c3A941FC4' as const

export const erc1155SinglePortalConfig = {
    address: erc1155SinglePortalAddress,
    abi: erc1155SinglePortalAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20Portal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20PortalAbi = [
    {
        type: 'constructor',
        inputs: [
            {
                name: '_inputBox',
                internalType: 'contract IInputBox',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_token',
                internalType: 'contract IERC20',
                type: 'address',
            },
            { name: '_dapp', internalType: 'address', type: 'address' },
            { name: '_amount', internalType: 'uint256', type: 'uint256' },
            { name: '_execLayerData', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'depositERC20Tokens',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'getInputBox',
        outputs: [
            { name: '', internalType: 'contract IInputBox', type: 'address' },
        ],
        stateMutability: 'view',
    },
] as const

export const erc20PortalAddress =
    '0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB' as const

export const erc20PortalConfig = {
    address: erc20PortalAddress,
    abi: erc20PortalAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC721Portal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc721PortalAbi = [
    {
        type: 'constructor',
        inputs: [
            {
                name: '_inputBox',
                internalType: 'contract IInputBox',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_token',
                internalType: 'contract IERC721',
                type: 'address',
            },
            { name: '_dapp', internalType: 'address', type: 'address' },
            { name: '_tokenId', internalType: 'uint256', type: 'uint256' },
            { name: '_baseLayerData', internalType: 'bytes', type: 'bytes' },
            { name: '_execLayerData', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'depositERC721Token',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'getInputBox',
        outputs: [
            { name: '', internalType: 'contract IInputBox', type: 'address' },
        ],
        stateMutability: 'view',
    },
] as const

export const erc721PortalAddress =
    '0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87' as const

export const erc721PortalConfig = {
    address: erc721PortalAddress,
    abi: erc721PortalAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EtherPortal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const etherPortalAbi = [
    {
        type: 'constructor',
        inputs: [
            {
                name: '_inputBox',
                internalType: 'contract IInputBox',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    { type: 'error', inputs: [], name: 'EtherTransferFailed' },
    {
        type: 'function',
        inputs: [
            { name: '_dapp', internalType: 'address', type: 'address' },
            { name: '_execLayerData', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'depositEther',
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'getInputBox',
        outputs: [
            { name: '', internalType: 'contract IInputBox', type: 'address' },
        ],
        stateMutability: 'view',
    },
] as const

export const etherPortalAddress =
    '0xFfdbe43d4c855BF7e0f105c400A50857f53AB044' as const

export const etherPortalConfig = {
    address: etherPortalAddress,
    abi: etherPortalAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HistoryFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const historyFactoryAbi = [
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'historyOwner',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
            {
                name: 'history',
                internalType: 'contract History',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'HistoryCreated',
    },
    {
        type: 'function',
        inputs: [
            { name: '_historyOwner', internalType: 'address', type: 'address' },
            { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'calculateHistoryAddress',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '_historyOwner', internalType: 'address', type: 'address' },
            { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'newHistory',
        outputs: [
            { name: '', internalType: 'contract History', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: '_historyOwner', internalType: 'address', type: 'address' },
        ],
        name: 'newHistory',
        outputs: [
            { name: '', internalType: 'contract History', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
] as const

export const historyFactoryAddress =
    '0x1f158b5320BBf677FdA89F9a438df99BbE560A26' as const

export const historyFactoryConfig = {
    address: historyFactoryAddress,
    abi: historyFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// InputBox
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const inputBoxAbi = [
    { type: 'error', inputs: [], name: 'InputSizeExceedsLimit' },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'dapp',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'inputIndex',
                internalType: 'uint256',
                type: 'uint256',
                indexed: true,
            },
            {
                name: 'sender',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
            {
                name: 'input',
                internalType: 'bytes',
                type: 'bytes',
                indexed: false,
            },
        ],
        name: 'InputAdded',
    },
    {
        type: 'function',
        inputs: [
            { name: '_dapp', internalType: 'address', type: 'address' },
            { name: '_input', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'addInput',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: '_dapp', internalType: 'address', type: 'address' },
            { name: '_index', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'getInputHash',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: '_dapp', internalType: 'address', type: 'address' }],
        name: 'getNumberOfInputs',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
] as const

export const inputBoxAddress =
    '0x59b22D57D4f067708AB0c00552767405926dc768' as const

export const inputBoxConfig = {
    address: inputBoxAddress,
    abi: inputBoxAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MerkleV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const merkleV2Abi = [
    {
        type: 'function',
        inputs: [
            { name: 'hashes', internalType: 'bytes32[]', type: 'bytes32[]' },
        ],
        name: 'calculateRootFromPowerOfTwo',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
        name: 'getEmptyTreeHashAtIndex',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [
            { name: '_data', internalType: 'bytes', type: 'bytes' },
            { name: '_wordIndex', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'getHashOfWordAtIndex',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [
            { name: '_data', internalType: 'bytes', type: 'bytes' },
            { name: '_log2Size', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'getMerkleRootFromBytes',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [
            { name: '_position', internalType: 'uint256', type: 'uint256' },
            {
                name: '_logSizeOfReplacement',
                internalType: 'uint256',
                type: 'uint256',
            },
            {
                name: '_logSizeOfFullDrive',
                internalType: 'uint256',
                type: 'uint256',
            },
            { name: '_replacement', internalType: 'bytes32', type: 'bytes32' },
            { name: 'siblings', internalType: 'bytes32[]', type: 'bytes32[]' },
        ],
        name: 'getRootAfterReplacementInDrive',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'pure',
    },
] as const

export const merkleV2Address =
    '0x33436035441927Df1a73FE3AAC5906854632e53d' as const

export const merkleV2Config = {
    address: merkleV2Address,
    abi: merkleV2Abi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SelfHostedApplicationFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const selfHostedApplicationFactoryAbi = [
    {
        type: 'constructor',
        inputs: [
            {
                name: '_authorityHistoryPairFactory',
                internalType: 'contract IAuthorityHistoryPairFactory',
                type: 'address',
            },
            {
                name: '_applicationFactory',
                internalType: 'contract ICartesiDAppFactory',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_authorityOwner',
                internalType: 'address',
                type: 'address',
            },
            { name: '_dappOwner', internalType: 'address', type: 'address' },
            { name: '_templateHash', internalType: 'bytes32', type: 'bytes32' },
            { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'calculateAddresses',
        outputs: [
            { name: 'application_', internalType: 'address', type: 'address' },
            { name: 'authority_', internalType: 'address', type: 'address' },
            { name: 'history_', internalType: 'address', type: 'address' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_authorityOwner',
                internalType: 'address',
                type: 'address',
            },
            { name: '_dappOwner', internalType: 'address', type: 'address' },
            { name: '_templateHash', internalType: 'bytes32', type: 'bytes32' },
            { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'deployContracts',
        outputs: [
            {
                name: 'application_',
                internalType: 'contract CartesiDApp',
                type: 'address',
            },
            {
                name: 'authority_',
                internalType: 'contract Authority',
                type: 'address',
            },
            {
                name: 'history_',
                internalType: 'contract History',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'getApplicationFactory',
        outputs: [
            {
                name: '',
                internalType: 'contract ICartesiDAppFactory',
                type: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'getAuthorityHistoryPairFactory',
        outputs: [
            {
                name: '',
                internalType: 'contract IAuthorityHistoryPairFactory',
                type: 'address',
            },
        ],
        stateMutability: 'view',
    },
] as const

export const selfHostedApplicationFactoryAddress =
    '0x9E32e06Fd23675b2DF8eA8e6b0A25c3DF6a60AbC' as const

export const selfHostedApplicationFactoryConfig = {
    address: selfHostedApplicationFactoryAddress,
    abi: selfHostedApplicationFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SunodoMultiToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const sunodoMultiTokenAbi = [
    {
        type: 'constructor',
        inputs: [
            { name: 'initialOwner', internalType: 'address', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'error',
        inputs: [
            { name: 'sender', internalType: 'address', type: 'address' },
            { name: 'balance', internalType: 'uint256', type: 'uint256' },
            { name: 'needed', internalType: 'uint256', type: 'uint256' },
            { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'ERC1155InsufficientBalance',
    },
    {
        type: 'error',
        inputs: [
            { name: 'approver', internalType: 'address', type: 'address' },
        ],
        name: 'ERC1155InvalidApprover',
    },
    {
        type: 'error',
        inputs: [
            { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
            { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'ERC1155InvalidArrayLength',
    },
    {
        type: 'error',
        inputs: [
            { name: 'operator', internalType: 'address', type: 'address' },
        ],
        name: 'ERC1155InvalidOperator',
    },
    {
        type: 'error',
        inputs: [
            { name: 'receiver', internalType: 'address', type: 'address' },
        ],
        name: 'ERC1155InvalidReceiver',
    },
    {
        type: 'error',
        inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
        name: 'ERC1155InvalidSender',
    },
    {
        type: 'error',
        inputs: [
            { name: 'operator', internalType: 'address', type: 'address' },
            { name: 'owner', internalType: 'address', type: 'address' },
        ],
        name: 'ERC1155MissingApprovalForAll',
    },
    {
        type: 'error',
        inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
        name: 'OwnableInvalidOwner',
    },
    {
        type: 'error',
        inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
        name: 'OwnableUnauthorizedAccount',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'account',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'operator',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'approved',
                internalType: 'bool',
                type: 'bool',
                indexed: false,
            },
        ],
        name: 'ApprovalForAll',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'previousOwner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'newOwner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
        ],
        name: 'OwnershipTransferred',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'operator',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'from',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'to',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'ids',
                internalType: 'uint256[]',
                type: 'uint256[]',
                indexed: false,
            },
            {
                name: 'values',
                internalType: 'uint256[]',
                type: 'uint256[]',
                indexed: false,
            },
        ],
        name: 'TransferBatch',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'operator',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'from',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'to',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'id',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'value',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'TransferSingle',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'value',
                internalType: 'string',
                type: 'string',
                indexed: false,
            },
            {
                name: 'id',
                internalType: 'uint256',
                type: 'uint256',
                indexed: true,
            },
        ],
        name: 'URI',
    },
    {
        type: 'function',
        inputs: [
            { name: 'account', internalType: 'address', type: 'address' },
            { name: 'id', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'balanceOf',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'accounts', internalType: 'address[]', type: 'address[]' },
            { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
        ],
        name: 'balanceOfBatch',
        outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'account', internalType: 'address', type: 'address' },
            { name: 'operator', internalType: 'address', type: 'address' },
        ],
        name: 'isApprovedForAll',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'account', internalType: 'address', type: 'address' },
            { name: 'id', internalType: 'uint256', type: 'uint256' },
            { name: 'amount', internalType: 'uint256', type: 'uint256' },
            { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
            { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
            { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'mintBatch',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'owner',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'from', internalType: 'address', type: 'address' },
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
            { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
            { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'safeBatchTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'from', internalType: 'address', type: 'address' },
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'id', internalType: 'uint256', type: 'uint256' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
            { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'operator', internalType: 'address', type: 'address' },
            { name: 'approved', internalType: 'bool', type: 'bool' },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'newuri', internalType: 'string', type: 'string' }],
        name: 'setURI',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' },
        ],
        name: 'supportsInterface',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'newOwner', internalType: 'address', type: 'address' },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        name: 'uri',
        outputs: [{ name: '', internalType: 'string', type: 'string' }],
        stateMutability: 'view',
    },
] as const

export const sunodoMultiTokenAddress =
    '0xa376A4afa7D03A64Dc7aE194322468c170276c62' as const

export const sunodoMultiTokenConfig = {
    address: sunodoMultiTokenAddress,
    abi: sunodoMultiTokenAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SunodoNFT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const sunodoNftAbi = [
    {
        type: 'constructor',
        inputs: [
            { name: 'initialOwner', internalType: 'address', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'error',
        inputs: [
            { name: 'sender', internalType: 'address', type: 'address' },
            { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
            { name: 'owner', internalType: 'address', type: 'address' },
        ],
        name: 'ERC721IncorrectOwner',
    },
    {
        type: 'error',
        inputs: [
            { name: 'operator', internalType: 'address', type: 'address' },
            { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'ERC721InsufficientApproval',
    },
    {
        type: 'error',
        inputs: [
            { name: 'approver', internalType: 'address', type: 'address' },
        ],
        name: 'ERC721InvalidApprover',
    },
    {
        type: 'error',
        inputs: [
            { name: 'operator', internalType: 'address', type: 'address' },
        ],
        name: 'ERC721InvalidOperator',
    },
    {
        type: 'error',
        inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
        name: 'ERC721InvalidOwner',
    },
    {
        type: 'error',
        inputs: [
            { name: 'receiver', internalType: 'address', type: 'address' },
        ],
        name: 'ERC721InvalidReceiver',
    },
    {
        type: 'error',
        inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
        name: 'ERC721InvalidSender',
    },
    {
        type: 'error',
        inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
        name: 'ERC721NonexistentToken',
    },
    {
        type: 'error',
        inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
        name: 'OwnableInvalidOwner',
    },
    {
        type: 'error',
        inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
        name: 'OwnableUnauthorizedAccount',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'owner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'approved',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'tokenId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: true,
            },
        ],
        name: 'Approval',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'owner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'operator',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'approved',
                internalType: 'bool',
                type: 'bool',
                indexed: false,
            },
        ],
        name: 'ApprovalForAll',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: '_fromTokenId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: '_toTokenId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'BatchMetadataUpdate',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: '_tokenId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'MetadataUpdate',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'previousOwner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'newOwner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
        ],
        name: 'OwnershipTransferred',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'from',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'to',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'tokenId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: true,
            },
        ],
        name: 'Transfer',
    },
    {
        type: 'function',
        inputs: [
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
        name: 'getApproved',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'owner', internalType: 'address', type: 'address' },
            { name: 'operator', internalType: 'address', type: 'address' },
        ],
        name: 'isApprovedForAll',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'name',
        outputs: [{ name: '', internalType: 'string', type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'owner',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
        name: 'ownerOf',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
            { name: 'uri', internalType: 'string', type: 'string' },
        ],
        name: 'safeMint',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'from', internalType: 'address', type: 'address' },
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'from', internalType: 'address', type: 'address' },
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
            { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'operator', internalType: 'address', type: 'address' },
            { name: 'approved', internalType: 'bool', type: 'bool' },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' },
        ],
        name: 'supportsInterface',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', internalType: 'string', type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
        name: 'tokenURI',
        outputs: [{ name: '', internalType: 'string', type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'from', internalType: 'address', type: 'address' },
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'newOwner', internalType: 'address', type: 'address' },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
    },
] as const

export const sunodoNftAddress =
    '0x093771B61bBAC90C74576E007673068AaD6AE3B7' as const

export const sunodoNftConfig = {
    address: sunodoNftAddress,
    abi: sunodoNftAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SunodoToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const sunodoTokenAbi = [
    {
        type: 'constructor',
        inputs: [
            {
                name: 'initialAuthority',
                internalType: 'address',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'error',
        inputs: [
            { name: 'authority', internalType: 'address', type: 'address' },
        ],
        name: 'AccessManagedInvalidAuthority',
    },
    {
        type: 'error',
        inputs: [
            { name: 'caller', internalType: 'address', type: 'address' },
            { name: 'delay', internalType: 'uint32', type: 'uint32' },
        ],
        name: 'AccessManagedRequiredDelay',
    },
    {
        type: 'error',
        inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
        name: 'AccessManagedUnauthorized',
    },
    { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
    {
        type: 'error',
        inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
        name: 'ECDSAInvalidSignatureLength',
    },
    {
        type: 'error',
        inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
        name: 'ECDSAInvalidSignatureS',
    },
    {
        type: 'error',
        inputs: [
            { name: 'spender', internalType: 'address', type: 'address' },
            { name: 'allowance', internalType: 'uint256', type: 'uint256' },
            { name: 'needed', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'ERC20InsufficientAllowance',
    },
    {
        type: 'error',
        inputs: [
            { name: 'sender', internalType: 'address', type: 'address' },
            { name: 'balance', internalType: 'uint256', type: 'uint256' },
            { name: 'needed', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'ERC20InsufficientBalance',
    },
    {
        type: 'error',
        inputs: [
            { name: 'approver', internalType: 'address', type: 'address' },
        ],
        name: 'ERC20InvalidApprover',
    },
    {
        type: 'error',
        inputs: [
            { name: 'receiver', internalType: 'address', type: 'address' },
        ],
        name: 'ERC20InvalidReceiver',
    },
    {
        type: 'error',
        inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
        name: 'ERC20InvalidSender',
    },
    {
        type: 'error',
        inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
        name: 'ERC20InvalidSpender',
    },
    {
        type: 'error',
        inputs: [
            { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'ERC2612ExpiredSignature',
    },
    {
        type: 'error',
        inputs: [
            { name: 'signer', internalType: 'address', type: 'address' },
            { name: 'owner', internalType: 'address', type: 'address' },
        ],
        name: 'ERC2612InvalidSigner',
    },
    { type: 'error', inputs: [], name: 'EnforcedPause' },
    { type: 'error', inputs: [], name: 'ExpectedPause' },
    {
        type: 'error',
        inputs: [
            { name: 'account', internalType: 'address', type: 'address' },
            { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'InvalidAccountNonce',
    },
    { type: 'error', inputs: [], name: 'InvalidShortString' },
    {
        type: 'error',
        inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
        name: 'StringTooLong',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'owner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'spender',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'value',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'Approval',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'authority',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'AuthorityUpdated',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [],
        name: 'EIP712DomainChanged',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'account',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'Paused',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'from',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'to',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'value',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'Transfer',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'account',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'Unpaused',
    },
    {
        type: 'function',
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'owner', internalType: 'address', type: 'address' },
            { name: 'spender', internalType: 'address', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'spender', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'authority',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'account', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'burnFrom',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'eip712Domain',
        outputs: [
            { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
            { name: 'name', internalType: 'string', type: 'string' },
            { name: 'version', internalType: 'string', type: 'string' },
            { name: 'chainId', internalType: 'uint256', type: 'uint256' },
            {
                name: 'verifyingContract',
                internalType: 'address',
                type: 'address',
            },
            { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
            {
                name: 'extensions',
                internalType: 'uint256[]',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'isConsumingScheduledOp',
        outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'name',
        outputs: [{ name: '', internalType: 'string', type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
        name: 'nonces',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'paused',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'owner', internalType: 'address', type: 'address' },
            { name: 'spender', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
            { name: 'deadline', internalType: 'uint256', type: 'uint256' },
            { name: 'v', internalType: 'uint8', type: 'uint8' },
            { name: 'r', internalType: 'bytes32', type: 'bytes32' },
            { name: 's', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'newAuthority', internalType: 'address', type: 'address' },
        ],
        name: 'setAuthority',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', internalType: 'string', type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'from', internalType: 'address', type: 'address' },
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'unpause',
        outputs: [],
        stateMutability: 'nonpayable',
    },
] as const

export const sunodoTokenAddress =
    '0xf795b3D15D47ac1c61BEf4Cc6469EBb2454C6a9b' as const

export const sunodoTokenConfig = {
    address: sunodoTokenAddress,
    abi: sunodoTokenAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UnrolledCordic
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const unrolledCordicAbi = [
    {
        type: 'function',
        inputs: [{ name: 'val', internalType: 'uint256', type: 'uint256' }],
        name: 'log2Times1e18',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'pure',
    },
] as const

export const unrolledCordicAddress =
    '0x3F8FdcD1B0F421D817BF58C96b7C91B98100B450' as const

export const unrolledCordicConfig = {
    address: unrolledCordicAddress,
    abi: unrolledCordicAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// erc20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
    {
        type: 'event',
        inputs: [
            { name: 'owner', type: 'address', indexed: true },
            { name: 'spender', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
        ],
        name: 'Approval',
    },
    {
        type: 'event',
        inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
        ],
        name: 'Transfer',
    },
    {
        type: 'function',
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'decimals',
        outputs: [{ type: 'uint8' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'name',
        outputs: [{ type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'symbol',
        outputs: [{ type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'totalSupply',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'sender', type: 'address' },
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ type: 'bool' }],
        stateMutability: 'nonpayable',
    },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link authorityFactoryAbi}__
 */
export const useReadAuthorityFactory = /*#__PURE__*/ createUseReadContract({
    abi: authorityFactoryAbi,
    address: authorityFactoryAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link authorityFactoryAbi}__ and `functionName` set to `"calculateAuthorityAddress"`
 */
export const useReadAuthorityFactoryCalculateAuthorityAddress =
    /*#__PURE__*/ createUseReadContract({
        abi: authorityFactoryAbi,
        address: authorityFactoryAddress,
        functionName: 'calculateAuthorityAddress',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link authorityFactoryAbi}__
 */
export const useWriteAuthorityFactory = /*#__PURE__*/ createUseWriteContract({
    abi: authorityFactoryAbi,
    address: authorityFactoryAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link authorityFactoryAbi}__ and `functionName` set to `"newAuthority"`
 */
export const useWriteAuthorityFactoryNewAuthority =
    /*#__PURE__*/ createUseWriteContract({
        abi: authorityFactoryAbi,
        address: authorityFactoryAddress,
        functionName: 'newAuthority',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link authorityFactoryAbi}__
 */
export const useSimulateAuthorityFactory =
    /*#__PURE__*/ createUseSimulateContract({
        abi: authorityFactoryAbi,
        address: authorityFactoryAddress,
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link authorityFactoryAbi}__ and `functionName` set to `"newAuthority"`
 */
export const useSimulateAuthorityFactoryNewAuthority =
    /*#__PURE__*/ createUseSimulateContract({
        abi: authorityFactoryAbi,
        address: authorityFactoryAddress,
        functionName: 'newAuthority',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link authorityFactoryAbi}__
 */
export const useWatchAuthorityFactoryEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: authorityFactoryAbi,
        address: authorityFactoryAddress,
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link authorityFactoryAbi}__ and `eventName` set to `"AuthorityCreated"`
 */
export const useWatchAuthorityFactoryAuthorityCreatedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: authorityFactoryAbi,
        address: authorityFactoryAddress,
        eventName: 'AuthorityCreated',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link authorityHistoryPairFactoryAbi}__
 */
export const useReadAuthorityHistoryPairFactory =
    /*#__PURE__*/ createUseReadContract({
        abi: authorityHistoryPairFactoryAbi,
        address: authorityHistoryPairFactoryAddress,
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link authorityHistoryPairFactoryAbi}__ and `functionName` set to `"calculateAuthorityHistoryAddressPair"`
 */
export const useReadAuthorityHistoryPairFactoryCalculateAuthorityHistoryAddressPair =
    /*#__PURE__*/ createUseReadContract({
        abi: authorityHistoryPairFactoryAbi,
        address: authorityHistoryPairFactoryAddress,
        functionName: 'calculateAuthorityHistoryAddressPair',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link authorityHistoryPairFactoryAbi}__ and `functionName` set to `"getAuthorityFactory"`
 */
export const useReadAuthorityHistoryPairFactoryGetAuthorityFactory =
    /*#__PURE__*/ createUseReadContract({
        abi: authorityHistoryPairFactoryAbi,
        address: authorityHistoryPairFactoryAddress,
        functionName: 'getAuthorityFactory',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link authorityHistoryPairFactoryAbi}__ and `functionName` set to `"getHistoryFactory"`
 */
export const useReadAuthorityHistoryPairFactoryGetHistoryFactory =
    /*#__PURE__*/ createUseReadContract({
        abi: authorityHistoryPairFactoryAbi,
        address: authorityHistoryPairFactoryAddress,
        functionName: 'getHistoryFactory',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link authorityHistoryPairFactoryAbi}__
 */
export const useWriteAuthorityHistoryPairFactory =
    /*#__PURE__*/ createUseWriteContract({
        abi: authorityHistoryPairFactoryAbi,
        address: authorityHistoryPairFactoryAddress,
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link authorityHistoryPairFactoryAbi}__ and `functionName` set to `"newAuthorityHistoryPair"`
 */
export const useWriteAuthorityHistoryPairFactoryNewAuthorityHistoryPair =
    /*#__PURE__*/ createUseWriteContract({
        abi: authorityHistoryPairFactoryAbi,
        address: authorityHistoryPairFactoryAddress,
        functionName: 'newAuthorityHistoryPair',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link authorityHistoryPairFactoryAbi}__
 */
export const useSimulateAuthorityHistoryPairFactory =
    /*#__PURE__*/ createUseSimulateContract({
        abi: authorityHistoryPairFactoryAbi,
        address: authorityHistoryPairFactoryAddress,
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link authorityHistoryPairFactoryAbi}__ and `functionName` set to `"newAuthorityHistoryPair"`
 */
export const useSimulateAuthorityHistoryPairFactoryNewAuthorityHistoryPair =
    /*#__PURE__*/ createUseSimulateContract({
        abi: authorityHistoryPairFactoryAbi,
        address: authorityHistoryPairFactoryAddress,
        functionName: 'newAuthorityHistoryPair',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link authorityHistoryPairFactoryAbi}__
 */
export const useWatchAuthorityHistoryPairFactoryEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: authorityHistoryPairFactoryAbi,
        address: authorityHistoryPairFactoryAddress,
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link authorityHistoryPairFactoryAbi}__ and `eventName` set to `"AuthorityHistoryPairFactoryCreated"`
 */
export const useWatchAuthorityHistoryPairFactoryAuthorityHistoryPairFactoryCreatedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: authorityHistoryPairFactoryAbi,
        address: authorityHistoryPairFactoryAddress,
        eventName: 'AuthorityHistoryPairFactoryCreated',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cartesiDAppFactoryAbi}__
 */
export const useReadCartesiDAppFactory = /*#__PURE__*/ createUseReadContract({
    abi: cartesiDAppFactoryAbi,
    address: cartesiDAppFactoryAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cartesiDAppFactoryAbi}__ and `functionName` set to `"calculateApplicationAddress"`
 */
export const useReadCartesiDAppFactoryCalculateApplicationAddress =
    /*#__PURE__*/ createUseReadContract({
        abi: cartesiDAppFactoryAbi,
        address: cartesiDAppFactoryAddress,
        functionName: 'calculateApplicationAddress',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cartesiDAppFactoryAbi}__
 */
export const useWriteCartesiDAppFactory = /*#__PURE__*/ createUseWriteContract({
    abi: cartesiDAppFactoryAbi,
    address: cartesiDAppFactoryAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cartesiDAppFactoryAbi}__ and `functionName` set to `"newApplication"`
 */
export const useWriteCartesiDAppFactoryNewApplication =
    /*#__PURE__*/ createUseWriteContract({
        abi: cartesiDAppFactoryAbi,
        address: cartesiDAppFactoryAddress,
        functionName: 'newApplication',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cartesiDAppFactoryAbi}__
 */
export const useSimulateCartesiDAppFactory =
    /*#__PURE__*/ createUseSimulateContract({
        abi: cartesiDAppFactoryAbi,
        address: cartesiDAppFactoryAddress,
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cartesiDAppFactoryAbi}__ and `functionName` set to `"newApplication"`
 */
export const useSimulateCartesiDAppFactoryNewApplication =
    /*#__PURE__*/ createUseSimulateContract({
        abi: cartesiDAppFactoryAbi,
        address: cartesiDAppFactoryAddress,
        functionName: 'newApplication',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cartesiDAppFactoryAbi}__
 */
export const useWatchCartesiDAppFactoryEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: cartesiDAppFactoryAbi,
        address: cartesiDAppFactoryAddress,
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cartesiDAppFactoryAbi}__ and `eventName` set to `"ApplicationCreated"`
 */
export const useWatchCartesiDAppFactoryApplicationCreatedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: cartesiDAppFactoryAbi,
        address: cartesiDAppFactoryAddress,
        eventName: 'ApplicationCreated',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cartesiMathV2Abi}__
 */
export const useReadCartesiMathV2 = /*#__PURE__*/ createUseReadContract({
    abi: cartesiMathV2Abi,
    address: cartesiMathV2Address,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cartesiMathV2Abi}__ and `functionName` set to `"clz"`
 */
export const useReadCartesiMathV2Clz = /*#__PURE__*/ createUseReadContract({
    abi: cartesiMathV2Abi,
    address: cartesiMathV2Address,
    functionName: 'clz',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cartesiMathV2Abi}__ and `functionName` set to `"ctz"`
 */
export const useReadCartesiMathV2Ctz = /*#__PURE__*/ createUseReadContract({
    abi: cartesiMathV2Abi,
    address: cartesiMathV2Address,
    functionName: 'ctz',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cartesiMathV2Abi}__ and `functionName` set to `"getLog2Floor"`
 */
export const useReadCartesiMathV2GetLog2Floor =
    /*#__PURE__*/ createUseReadContract({
        abi: cartesiMathV2Abi,
        address: cartesiMathV2Address,
        functionName: 'getLog2Floor',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cartesiMathV2Abi}__ and `functionName` set to `"getLog2TableTimes1M"`
 */
export const useReadCartesiMathV2GetLog2TableTimes1M =
    /*#__PURE__*/ createUseReadContract({
        abi: cartesiMathV2Abi,
        address: cartesiMathV2Address,
        functionName: 'getLog2TableTimes1M',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cartesiMathV2Abi}__ and `functionName` set to `"isPowerOf2"`
 */
export const useReadCartesiMathV2IsPowerOf2 =
    /*#__PURE__*/ createUseReadContract({
        abi: cartesiMathV2Abi,
        address: cartesiMathV2Address,
        functionName: 'isPowerOf2',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cartesiMathV2Abi}__ and `functionName` set to `"log2ApproxTimes1M"`
 */
export const useReadCartesiMathV2Log2ApproxTimes1M =
    /*#__PURE__*/ createUseReadContract({
        abi: cartesiMathV2Abi,
        address: cartesiMathV2Address,
        functionName: 'log2ApproxTimes1M',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dAppAddressRelayAbi}__
 */
export const useReadDAppAddressRelay = /*#__PURE__*/ createUseReadContract({
    abi: dAppAddressRelayAbi,
    address: dAppAddressRelayAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dAppAddressRelayAbi}__ and `functionName` set to `"getInputBox"`
 */
export const useReadDAppAddressRelayGetInputBox =
    /*#__PURE__*/ createUseReadContract({
        abi: dAppAddressRelayAbi,
        address: dAppAddressRelayAddress,
        functionName: 'getInputBox',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dAppAddressRelayAbi}__
 */
export const useWriteDAppAddressRelay = /*#__PURE__*/ createUseWriteContract({
    abi: dAppAddressRelayAbi,
    address: dAppAddressRelayAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dAppAddressRelayAbi}__ and `functionName` set to `"relayDAppAddress"`
 */
export const useWriteDAppAddressRelayRelayDAppAddress =
    /*#__PURE__*/ createUseWriteContract({
        abi: dAppAddressRelayAbi,
        address: dAppAddressRelayAddress,
        functionName: 'relayDAppAddress',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dAppAddressRelayAbi}__
 */
export const useSimulateDAppAddressRelay =
    /*#__PURE__*/ createUseSimulateContract({
        abi: dAppAddressRelayAbi,
        address: dAppAddressRelayAddress,
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dAppAddressRelayAbi}__ and `functionName` set to `"relayDAppAddress"`
 */
export const useSimulateDAppAddressRelayRelayDAppAddress =
    /*#__PURE__*/ createUseSimulateContract({
        abi: dAppAddressRelayAbi,
        address: dAppAddressRelayAddress,
        functionName: 'relayDAppAddress',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155BatchPortalAbi}__
 */
export const useReadErc1155BatchPortal = /*#__PURE__*/ createUseReadContract({
    abi: erc1155BatchPortalAbi,
    address: erc1155BatchPortalAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155BatchPortalAbi}__ and `functionName` set to `"getInputBox"`
 */
export const useReadErc1155BatchPortalGetInputBox =
    /*#__PURE__*/ createUseReadContract({
        abi: erc1155BatchPortalAbi,
        address: erc1155BatchPortalAddress,
        functionName: 'getInputBox',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155BatchPortalAbi}__
 */
export const useWriteErc1155BatchPortal = /*#__PURE__*/ createUseWriteContract({
    abi: erc1155BatchPortalAbi,
    address: erc1155BatchPortalAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155BatchPortalAbi}__ and `functionName` set to `"depositBatchERC1155Token"`
 */
export const useWriteErc1155BatchPortalDepositBatchErc1155Token =
    /*#__PURE__*/ createUseWriteContract({
        abi: erc1155BatchPortalAbi,
        address: erc1155BatchPortalAddress,
        functionName: 'depositBatchERC1155Token',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155BatchPortalAbi}__
 */
export const useSimulateErc1155BatchPortal =
    /*#__PURE__*/ createUseSimulateContract({
        abi: erc1155BatchPortalAbi,
        address: erc1155BatchPortalAddress,
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155BatchPortalAbi}__ and `functionName` set to `"depositBatchERC1155Token"`
 */
export const useSimulateErc1155BatchPortalDepositBatchErc1155Token =
    /*#__PURE__*/ createUseSimulateContract({
        abi: erc1155BatchPortalAbi,
        address: erc1155BatchPortalAddress,
        functionName: 'depositBatchERC1155Token',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155SinglePortalAbi}__
 */
export const useReadErc1155SinglePortal = /*#__PURE__*/ createUseReadContract({
    abi: erc1155SinglePortalAbi,
    address: erc1155SinglePortalAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155SinglePortalAbi}__ and `functionName` set to `"getInputBox"`
 */
export const useReadErc1155SinglePortalGetInputBox =
    /*#__PURE__*/ createUseReadContract({
        abi: erc1155SinglePortalAbi,
        address: erc1155SinglePortalAddress,
        functionName: 'getInputBox',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155SinglePortalAbi}__
 */
export const useWriteErc1155SinglePortal = /*#__PURE__*/ createUseWriteContract(
    { abi: erc1155SinglePortalAbi, address: erc1155SinglePortalAddress },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155SinglePortalAbi}__ and `functionName` set to `"depositSingleERC1155Token"`
 */
export const useWriteErc1155SinglePortalDepositSingleErc1155Token =
    /*#__PURE__*/ createUseWriteContract({
        abi: erc1155SinglePortalAbi,
        address: erc1155SinglePortalAddress,
        functionName: 'depositSingleERC1155Token',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155SinglePortalAbi}__
 */
export const useSimulateErc1155SinglePortal =
    /*#__PURE__*/ createUseSimulateContract({
        abi: erc1155SinglePortalAbi,
        address: erc1155SinglePortalAddress,
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155SinglePortalAbi}__ and `functionName` set to `"depositSingleERC1155Token"`
 */
export const useSimulateErc1155SinglePortalDepositSingleErc1155Token =
    /*#__PURE__*/ createUseSimulateContract({
        abi: erc1155SinglePortalAbi,
        address: erc1155SinglePortalAddress,
        functionName: 'depositSingleERC1155Token',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20PortalAbi}__
 */
export const useReadErc20Portal = /*#__PURE__*/ createUseReadContract({
    abi: erc20PortalAbi,
    address: erc20PortalAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20PortalAbi}__ and `functionName` set to `"getInputBox"`
 */
export const useReadErc20PortalGetInputBox =
    /*#__PURE__*/ createUseReadContract({
        abi: erc20PortalAbi,
        address: erc20PortalAddress,
        functionName: 'getInputBox',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20PortalAbi}__
 */
export const useWriteErc20Portal = /*#__PURE__*/ createUseWriteContract({
    abi: erc20PortalAbi,
    address: erc20PortalAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20PortalAbi}__ and `functionName` set to `"depositERC20Tokens"`
 */
export const useWriteErc20PortalDepositErc20Tokens =
    /*#__PURE__*/ createUseWriteContract({
        abi: erc20PortalAbi,
        address: erc20PortalAddress,
        functionName: 'depositERC20Tokens',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20PortalAbi}__
 */
export const useSimulateErc20Portal = /*#__PURE__*/ createUseSimulateContract({
    abi: erc20PortalAbi,
    address: erc20PortalAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20PortalAbi}__ and `functionName` set to `"depositERC20Tokens"`
 */
export const useSimulateErc20PortalDepositErc20Tokens =
    /*#__PURE__*/ createUseSimulateContract({
        abi: erc20PortalAbi,
        address: erc20PortalAddress,
        functionName: 'depositERC20Tokens',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721PortalAbi}__
 */
export const useReadErc721Portal = /*#__PURE__*/ createUseReadContract({
    abi: erc721PortalAbi,
    address: erc721PortalAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721PortalAbi}__ and `functionName` set to `"getInputBox"`
 */
export const useReadErc721PortalGetInputBox =
    /*#__PURE__*/ createUseReadContract({
        abi: erc721PortalAbi,
        address: erc721PortalAddress,
        functionName: 'getInputBox',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721PortalAbi}__
 */
export const useWriteErc721Portal = /*#__PURE__*/ createUseWriteContract({
    abi: erc721PortalAbi,
    address: erc721PortalAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721PortalAbi}__ and `functionName` set to `"depositERC721Token"`
 */
export const useWriteErc721PortalDepositErc721Token =
    /*#__PURE__*/ createUseWriteContract({
        abi: erc721PortalAbi,
        address: erc721PortalAddress,
        functionName: 'depositERC721Token',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721PortalAbi}__
 */
export const useSimulateErc721Portal = /*#__PURE__*/ createUseSimulateContract({
    abi: erc721PortalAbi,
    address: erc721PortalAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721PortalAbi}__ and `functionName` set to `"depositERC721Token"`
 */
export const useSimulateErc721PortalDepositErc721Token =
    /*#__PURE__*/ createUseSimulateContract({
        abi: erc721PortalAbi,
        address: erc721PortalAddress,
        functionName: 'depositERC721Token',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link etherPortalAbi}__
 */
export const useReadEtherPortal = /*#__PURE__*/ createUseReadContract({
    abi: etherPortalAbi,
    address: etherPortalAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link etherPortalAbi}__ and `functionName` set to `"getInputBox"`
 */
export const useReadEtherPortalGetInputBox =
    /*#__PURE__*/ createUseReadContract({
        abi: etherPortalAbi,
        address: etherPortalAddress,
        functionName: 'getInputBox',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link etherPortalAbi}__
 */
export const useWriteEtherPortal = /*#__PURE__*/ createUseWriteContract({
    abi: etherPortalAbi,
    address: etherPortalAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link etherPortalAbi}__ and `functionName` set to `"depositEther"`
 */
export const useWriteEtherPortalDepositEther =
    /*#__PURE__*/ createUseWriteContract({
        abi: etherPortalAbi,
        address: etherPortalAddress,
        functionName: 'depositEther',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link etherPortalAbi}__
 */
export const useSimulateEtherPortal = /*#__PURE__*/ createUseSimulateContract({
    abi: etherPortalAbi,
    address: etherPortalAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link etherPortalAbi}__ and `functionName` set to `"depositEther"`
 */
export const useSimulateEtherPortalDepositEther =
    /*#__PURE__*/ createUseSimulateContract({
        abi: etherPortalAbi,
        address: etherPortalAddress,
        functionName: 'depositEther',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link historyFactoryAbi}__
 */
export const useReadHistoryFactory = /*#__PURE__*/ createUseReadContract({
    abi: historyFactoryAbi,
    address: historyFactoryAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link historyFactoryAbi}__ and `functionName` set to `"calculateHistoryAddress"`
 */
export const useReadHistoryFactoryCalculateHistoryAddress =
    /*#__PURE__*/ createUseReadContract({
        abi: historyFactoryAbi,
        address: historyFactoryAddress,
        functionName: 'calculateHistoryAddress',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link historyFactoryAbi}__
 */
export const useWriteHistoryFactory = /*#__PURE__*/ createUseWriteContract({
    abi: historyFactoryAbi,
    address: historyFactoryAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link historyFactoryAbi}__ and `functionName` set to `"newHistory"`
 */
export const useWriteHistoryFactoryNewHistory =
    /*#__PURE__*/ createUseWriteContract({
        abi: historyFactoryAbi,
        address: historyFactoryAddress,
        functionName: 'newHistory',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link historyFactoryAbi}__
 */
export const useSimulateHistoryFactory =
    /*#__PURE__*/ createUseSimulateContract({
        abi: historyFactoryAbi,
        address: historyFactoryAddress,
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link historyFactoryAbi}__ and `functionName` set to `"newHistory"`
 */
export const useSimulateHistoryFactoryNewHistory =
    /*#__PURE__*/ createUseSimulateContract({
        abi: historyFactoryAbi,
        address: historyFactoryAddress,
        functionName: 'newHistory',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link historyFactoryAbi}__
 */
export const useWatchHistoryFactoryEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: historyFactoryAbi,
        address: historyFactoryAddress,
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link historyFactoryAbi}__ and `eventName` set to `"HistoryCreated"`
 */
export const useWatchHistoryFactoryHistoryCreatedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: historyFactoryAbi,
        address: historyFactoryAddress,
        eventName: 'HistoryCreated',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link inputBoxAbi}__
 */
export const useReadInputBox = /*#__PURE__*/ createUseReadContract({
    abi: inputBoxAbi,
    address: inputBoxAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link inputBoxAbi}__ and `functionName` set to `"getInputHash"`
 */
export const useReadInputBoxGetInputHash = /*#__PURE__*/ createUseReadContract({
    abi: inputBoxAbi,
    address: inputBoxAddress,
    functionName: 'getInputHash',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link inputBoxAbi}__ and `functionName` set to `"getNumberOfInputs"`
 */
export const useReadInputBoxGetNumberOfInputs =
    /*#__PURE__*/ createUseReadContract({
        abi: inputBoxAbi,
        address: inputBoxAddress,
        functionName: 'getNumberOfInputs',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link inputBoxAbi}__
 */
export const useWriteInputBox = /*#__PURE__*/ createUseWriteContract({
    abi: inputBoxAbi,
    address: inputBoxAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link inputBoxAbi}__ and `functionName` set to `"addInput"`
 */
export const useWriteInputBoxAddInput = /*#__PURE__*/ createUseWriteContract({
    abi: inputBoxAbi,
    address: inputBoxAddress,
    functionName: 'addInput',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link inputBoxAbi}__
 */
export const useSimulateInputBox = /*#__PURE__*/ createUseSimulateContract({
    abi: inputBoxAbi,
    address: inputBoxAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link inputBoxAbi}__ and `functionName` set to `"addInput"`
 */
export const useSimulateInputBoxAddInput =
    /*#__PURE__*/ createUseSimulateContract({
        abi: inputBoxAbi,
        address: inputBoxAddress,
        functionName: 'addInput',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link inputBoxAbi}__
 */
export const useWatchInputBoxEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: inputBoxAbi,
    address: inputBoxAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link inputBoxAbi}__ and `eventName` set to `"InputAdded"`
 */
export const useWatchInputBoxInputAddedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: inputBoxAbi,
        address: inputBoxAddress,
        eventName: 'InputAdded',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link merkleV2Abi}__
 */
export const useReadMerkleV2 = /*#__PURE__*/ createUseReadContract({
    abi: merkleV2Abi,
    address: merkleV2Address,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link merkleV2Abi}__ and `functionName` set to `"calculateRootFromPowerOfTwo"`
 */
export const useReadMerkleV2CalculateRootFromPowerOfTwo =
    /*#__PURE__*/ createUseReadContract({
        abi: merkleV2Abi,
        address: merkleV2Address,
        functionName: 'calculateRootFromPowerOfTwo',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link merkleV2Abi}__ and `functionName` set to `"getEmptyTreeHashAtIndex"`
 */
export const useReadMerkleV2GetEmptyTreeHashAtIndex =
    /*#__PURE__*/ createUseReadContract({
        abi: merkleV2Abi,
        address: merkleV2Address,
        functionName: 'getEmptyTreeHashAtIndex',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link merkleV2Abi}__ and `functionName` set to `"getHashOfWordAtIndex"`
 */
export const useReadMerkleV2GetHashOfWordAtIndex =
    /*#__PURE__*/ createUseReadContract({
        abi: merkleV2Abi,
        address: merkleV2Address,
        functionName: 'getHashOfWordAtIndex',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link merkleV2Abi}__ and `functionName` set to `"getMerkleRootFromBytes"`
 */
export const useReadMerkleV2GetMerkleRootFromBytes =
    /*#__PURE__*/ createUseReadContract({
        abi: merkleV2Abi,
        address: merkleV2Address,
        functionName: 'getMerkleRootFromBytes',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link merkleV2Abi}__ and `functionName` set to `"getRootAfterReplacementInDrive"`
 */
export const useReadMerkleV2GetRootAfterReplacementInDrive =
    /*#__PURE__*/ createUseReadContract({
        abi: merkleV2Abi,
        address: merkleV2Address,
        functionName: 'getRootAfterReplacementInDrive',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link selfHostedApplicationFactoryAbi}__
 */
export const useReadSelfHostedApplicationFactory =
    /*#__PURE__*/ createUseReadContract({
        abi: selfHostedApplicationFactoryAbi,
        address: selfHostedApplicationFactoryAddress,
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link selfHostedApplicationFactoryAbi}__ and `functionName` set to `"calculateAddresses"`
 */
export const useReadSelfHostedApplicationFactoryCalculateAddresses =
    /*#__PURE__*/ createUseReadContract({
        abi: selfHostedApplicationFactoryAbi,
        address: selfHostedApplicationFactoryAddress,
        functionName: 'calculateAddresses',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link selfHostedApplicationFactoryAbi}__ and `functionName` set to `"getApplicationFactory"`
 */
export const useReadSelfHostedApplicationFactoryGetApplicationFactory =
    /*#__PURE__*/ createUseReadContract({
        abi: selfHostedApplicationFactoryAbi,
        address: selfHostedApplicationFactoryAddress,
        functionName: 'getApplicationFactory',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link selfHostedApplicationFactoryAbi}__ and `functionName` set to `"getAuthorityHistoryPairFactory"`
 */
export const useReadSelfHostedApplicationFactoryGetAuthorityHistoryPairFactory =
    /*#__PURE__*/ createUseReadContract({
        abi: selfHostedApplicationFactoryAbi,
        address: selfHostedApplicationFactoryAddress,
        functionName: 'getAuthorityHistoryPairFactory',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link selfHostedApplicationFactoryAbi}__
 */
export const useWriteSelfHostedApplicationFactory =
    /*#__PURE__*/ createUseWriteContract({
        abi: selfHostedApplicationFactoryAbi,
        address: selfHostedApplicationFactoryAddress,
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link selfHostedApplicationFactoryAbi}__ and `functionName` set to `"deployContracts"`
 */
export const useWriteSelfHostedApplicationFactoryDeployContracts =
    /*#__PURE__*/ createUseWriteContract({
        abi: selfHostedApplicationFactoryAbi,
        address: selfHostedApplicationFactoryAddress,
        functionName: 'deployContracts',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link selfHostedApplicationFactoryAbi}__
 */
export const useSimulateSelfHostedApplicationFactory =
    /*#__PURE__*/ createUseSimulateContract({
        abi: selfHostedApplicationFactoryAbi,
        address: selfHostedApplicationFactoryAddress,
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link selfHostedApplicationFactoryAbi}__ and `functionName` set to `"deployContracts"`
 */
export const useSimulateSelfHostedApplicationFactoryDeployContracts =
    /*#__PURE__*/ createUseSimulateContract({
        abi: selfHostedApplicationFactoryAbi,
        address: selfHostedApplicationFactoryAddress,
        functionName: 'deployContracts',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__
 */
export const useReadSunodoMultiToken = /*#__PURE__*/ createUseReadContract({
    abi: sunodoMultiTokenAbi,
    address: sunodoMultiTokenAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadSunodoMultiTokenBalanceOf =
    /*#__PURE__*/ createUseReadContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'balanceOf',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadSunodoMultiTokenBalanceOfBatch =
    /*#__PURE__*/ createUseReadContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'balanceOfBatch',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadSunodoMultiTokenIsApprovedForAll =
    /*#__PURE__*/ createUseReadContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'isApprovedForAll',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"owner"`
 */
export const useReadSunodoMultiTokenOwner = /*#__PURE__*/ createUseReadContract(
    {
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'owner',
    },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadSunodoMultiTokenSupportsInterface =
    /*#__PURE__*/ createUseReadContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'supportsInterface',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"uri"`
 */
export const useReadSunodoMultiTokenUri = /*#__PURE__*/ createUseReadContract({
    abi: sunodoMultiTokenAbi,
    address: sunodoMultiTokenAddress,
    functionName: 'uri',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__
 */
export const useWriteSunodoMultiToken = /*#__PURE__*/ createUseWriteContract({
    abi: sunodoMultiTokenAbi,
    address: sunodoMultiTokenAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteSunodoMultiTokenMint =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'mint',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"mintBatch"`
 */
export const useWriteSunodoMultiTokenMintBatch =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'mintBatch',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteSunodoMultiTokenRenounceOwnership =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'renounceOwnership',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteSunodoMultiTokenSafeBatchTransferFrom =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'safeBatchTransferFrom',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteSunodoMultiTokenSafeTransferFrom =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'safeTransferFrom',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteSunodoMultiTokenSetApprovalForAll =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'setApprovalForAll',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"setURI"`
 */
export const useWriteSunodoMultiTokenSetUri =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'setURI',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteSunodoMultiTokenTransferOwnership =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'transferOwnership',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__
 */
export const useSimulateSunodoMultiToken =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateSunodoMultiTokenMint =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'mint',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"mintBatch"`
 */
export const useSimulateSunodoMultiTokenMintBatch =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'mintBatch',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateSunodoMultiTokenRenounceOwnership =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'renounceOwnership',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateSunodoMultiTokenSafeBatchTransferFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'safeBatchTransferFrom',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateSunodoMultiTokenSafeTransferFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'safeTransferFrom',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateSunodoMultiTokenSetApprovalForAll =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'setApprovalForAll',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"setURI"`
 */
export const useSimulateSunodoMultiTokenSetUri =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'setURI',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateSunodoMultiTokenTransferOwnership =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        functionName: 'transferOwnership',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoMultiTokenAbi}__
 */
export const useWatchSunodoMultiTokenEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchSunodoMultiTokenApprovalForAllEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        eventName: 'ApprovalForAll',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchSunodoMultiTokenOwnershipTransferredEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        eventName: 'OwnershipTransferred',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchSunodoMultiTokenTransferBatchEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        eventName: 'TransferBatch',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchSunodoMultiTokenTransferSingleEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        eventName: 'TransferSingle',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoMultiTokenAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchSunodoMultiTokenUriEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoMultiTokenAbi,
        address: sunodoMultiTokenAddress,
        eventName: 'URI',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoNftAbi}__
 */
export const useReadSunodoNft = /*#__PURE__*/ createUseReadContract({
    abi: sunodoNftAbi,
    address: sunodoNftAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadSunodoNftBalanceOf = /*#__PURE__*/ createUseReadContract({
    abi: sunodoNftAbi,
    address: sunodoNftAddress,
    functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadSunodoNftGetApproved = /*#__PURE__*/ createUseReadContract({
    abi: sunodoNftAbi,
    address: sunodoNftAddress,
    functionName: 'getApproved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadSunodoNftIsApprovedForAll =
    /*#__PURE__*/ createUseReadContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'isApprovedForAll',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"name"`
 */
export const useReadSunodoNftName = /*#__PURE__*/ createUseReadContract({
    abi: sunodoNftAbi,
    address: sunodoNftAddress,
    functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"owner"`
 */
export const useReadSunodoNftOwner = /*#__PURE__*/ createUseReadContract({
    abi: sunodoNftAbi,
    address: sunodoNftAddress,
    functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadSunodoNftOwnerOf = /*#__PURE__*/ createUseReadContract({
    abi: sunodoNftAbi,
    address: sunodoNftAddress,
    functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadSunodoNftSupportsInterface =
    /*#__PURE__*/ createUseReadContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'supportsInterface',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadSunodoNftSymbol = /*#__PURE__*/ createUseReadContract({
    abi: sunodoNftAbi,
    address: sunodoNftAddress,
    functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadSunodoNftTokenUri = /*#__PURE__*/ createUseReadContract({
    abi: sunodoNftAbi,
    address: sunodoNftAddress,
    functionName: 'tokenURI',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoNftAbi}__
 */
export const useWriteSunodoNft = /*#__PURE__*/ createUseWriteContract({
    abi: sunodoNftAbi,
    address: sunodoNftAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteSunodoNftApprove = /*#__PURE__*/ createUseWriteContract({
    abi: sunodoNftAbi,
    address: sunodoNftAddress,
    functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteSunodoNftRenounceOwnership =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'renounceOwnership',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"safeMint"`
 */
export const useWriteSunodoNftSafeMint = /*#__PURE__*/ createUseWriteContract({
    abi: sunodoNftAbi,
    address: sunodoNftAddress,
    functionName: 'safeMint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteSunodoNftSafeTransferFrom =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'safeTransferFrom',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteSunodoNftSetApprovalForAll =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'setApprovalForAll',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteSunodoNftTransferFrom =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'transferFrom',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteSunodoNftTransferOwnership =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'transferOwnership',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoNftAbi}__
 */
export const useSimulateSunodoNft = /*#__PURE__*/ createUseSimulateContract({
    abi: sunodoNftAbi,
    address: sunodoNftAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateSunodoNftApprove =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'approve',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateSunodoNftRenounceOwnership =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'renounceOwnership',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"safeMint"`
 */
export const useSimulateSunodoNftSafeMint =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'safeMint',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateSunodoNftSafeTransferFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'safeTransferFrom',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateSunodoNftSetApprovalForAll =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'setApprovalForAll',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateSunodoNftTransferFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'transferFrom',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoNftAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateSunodoNftTransferOwnership =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        functionName: 'transferOwnership',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoNftAbi}__
 */
export const useWatchSunodoNftEvent = /*#__PURE__*/ createUseWatchContractEvent(
    { abi: sunodoNftAbi, address: sunodoNftAddress },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoNftAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchSunodoNftApprovalEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        eventName: 'Approval',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoNftAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchSunodoNftApprovalForAllEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        eventName: 'ApprovalForAll',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoNftAbi}__ and `eventName` set to `"BatchMetadataUpdate"`
 */
export const useWatchSunodoNftBatchMetadataUpdateEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        eventName: 'BatchMetadataUpdate',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoNftAbi}__ and `eventName` set to `"MetadataUpdate"`
 */
export const useWatchSunodoNftMetadataUpdateEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        eventName: 'MetadataUpdate',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoNftAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchSunodoNftOwnershipTransferredEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        eventName: 'OwnershipTransferred',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoNftAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchSunodoNftTransferEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoNftAbi,
        address: sunodoNftAddress,
        eventName: 'Transfer',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__
 */
export const useReadSunodoToken = /*#__PURE__*/ createUseReadContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadSunodoTokenDomainSeparator =
    /*#__PURE__*/ createUseReadContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'DOMAIN_SEPARATOR',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadSunodoTokenAllowance = /*#__PURE__*/ createUseReadContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"authority"`
 */
export const useReadSunodoTokenAuthority = /*#__PURE__*/ createUseReadContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'authority',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadSunodoTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadSunodoTokenDecimals = /*#__PURE__*/ createUseReadContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useReadSunodoTokenEip712Domain =
    /*#__PURE__*/ createUseReadContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'eip712Domain',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"isConsumingScheduledOp"`
 */
export const useReadSunodoTokenIsConsumingScheduledOp =
    /*#__PURE__*/ createUseReadContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'isConsumingScheduledOp',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadSunodoTokenName = /*#__PURE__*/ createUseReadContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"nonces"`
 */
export const useReadSunodoTokenNonces = /*#__PURE__*/ createUseReadContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'nonces',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"paused"`
 */
export const useReadSunodoTokenPaused = /*#__PURE__*/ createUseReadContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadSunodoTokenSymbol = /*#__PURE__*/ createUseReadContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadSunodoTokenTotalSupply =
    /*#__PURE__*/ createUseReadContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'totalSupply',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoTokenAbi}__
 */
export const useWriteSunodoToken = /*#__PURE__*/ createUseWriteContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteSunodoTokenApprove = /*#__PURE__*/ createUseWriteContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteSunodoTokenBurn = /*#__PURE__*/ createUseWriteContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useWriteSunodoTokenBurnFrom = /*#__PURE__*/ createUseWriteContract(
    {
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'burnFrom',
    },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"pause"`
 */
export const useWriteSunodoTokenPause = /*#__PURE__*/ createUseWriteContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"permit"`
 */
export const useWriteSunodoTokenPermit = /*#__PURE__*/ createUseWriteContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'permit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useWriteSunodoTokenSetAuthority =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'setAuthority',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteSunodoTokenTransfer = /*#__PURE__*/ createUseWriteContract(
    {
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'transfer',
    },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteSunodoTokenTransferFrom =
    /*#__PURE__*/ createUseWriteContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'transferFrom',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"unpause"`
 */
export const useWriteSunodoTokenUnpause = /*#__PURE__*/ createUseWriteContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
    functionName: 'unpause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoTokenAbi}__
 */
export const useSimulateSunodoToken = /*#__PURE__*/ createUseSimulateContract({
    abi: sunodoTokenAbi,
    address: sunodoTokenAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateSunodoTokenApprove =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'approve',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateSunodoTokenBurn =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'burn',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useSimulateSunodoTokenBurnFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'burnFrom',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"pause"`
 */
export const useSimulateSunodoTokenPause =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'pause',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"permit"`
 */
export const useSimulateSunodoTokenPermit =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'permit',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useSimulateSunodoTokenSetAuthority =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'setAuthority',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateSunodoTokenTransfer =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'transfer',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateSunodoTokenTransferFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'transferFrom',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sunodoTokenAbi}__ and `functionName` set to `"unpause"`
 */
export const useSimulateSunodoTokenUnpause =
    /*#__PURE__*/ createUseSimulateContract({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        functionName: 'unpause',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoTokenAbi}__
 */
export const useWatchSunodoTokenEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchSunodoTokenApprovalEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        eventName: 'Approval',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoTokenAbi}__ and `eventName` set to `"AuthorityUpdated"`
 */
export const useWatchSunodoTokenAuthorityUpdatedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        eventName: 'AuthorityUpdated',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoTokenAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useWatchSunodoTokenEip712DomainChangedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        eventName: 'EIP712DomainChanged',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoTokenAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchSunodoTokenPausedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        eventName: 'Paused',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchSunodoTokenTransferEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        eventName: 'Transfer',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sunodoTokenAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchSunodoTokenUnpausedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: sunodoTokenAbi,
        address: sunodoTokenAddress,
        eventName: 'Unpaused',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link unrolledCordicAbi}__
 */
export const useReadUnrolledCordic = /*#__PURE__*/ createUseReadContract({
    abi: unrolledCordicAbi,
    address: unrolledCordicAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link unrolledCordicAbi}__ and `functionName` set to `"log2Times1e18"`
 */
export const useReadUnrolledCordicLog2Times1e18 =
    /*#__PURE__*/ createUseReadContract({
        abi: unrolledCordicAbi,
        address: unrolledCordicAddress,
        functionName: 'log2Times1e18',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useReadErc20 = /*#__PURE__*/ createUseReadContract({
    abi: erc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadErc20Allowance = /*#__PURE__*/ createUseReadContract({
    abi: erc20Abi,
    functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc20BalanceOf = /*#__PURE__*/ createUseReadContract({
    abi: erc20Abi,
    functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadErc20Decimals = /*#__PURE__*/ createUseReadContract({
    abi: erc20Abi,
    functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const useReadErc20Name = /*#__PURE__*/ createUseReadContract({
    abi: erc20Abi,
    functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc20Symbol = /*#__PURE__*/ createUseReadContract({
    abi: erc20Abi,
    functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadErc20TotalSupply = /*#__PURE__*/ createUseReadContract({
    abi: erc20Abi,
    functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWriteErc20 = /*#__PURE__*/ createUseWriteContract({
    abi: erc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc20Approve = /*#__PURE__*/ createUseWriteContract({
    abi: erc20Abi,
    functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteErc20Transfer = /*#__PURE__*/ createUseWriteContract({
    abi: erc20Abi,
    functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
    abi: erc20Abi,
    functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useSimulateErc20 = /*#__PURE__*/ createUseSimulateContract({
    abi: erc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc20Approve = /*#__PURE__*/ createUseSimulateContract({
    abi: erc20Abi,
    functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateErc20Transfer = /*#__PURE__*/ createUseSimulateContract(
    { abi: erc20Abi, functionName: 'transfer' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc20TransferFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: erc20Abi,
        functionName: 'transferFrom',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWatchErc20Event = /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc20ApprovalEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: erc20Abi,
        eventName: 'Approval',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc20TransferEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: erc20Abi,
        eventName: 'Transfer',
    })
