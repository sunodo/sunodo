import {
    createUseReadContract,
    createUseWriteContract,
    createUseSimulateContract,
    createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ApplicationFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const applicationFactoryAbi = [
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
                name: 'appOwner',
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
                name: 'appContract',
                internalType: 'contract IApplication',
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
                name: 'consensus',
                internalType: 'contract IConsensus',
                type: 'address',
            },
            { name: 'appOwner', internalType: 'address', type: 'address' },
            { name: 'templateHash', internalType: 'bytes32', type: 'bytes32' },
            { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'calculateApplicationAddress',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: 'consensus',
                internalType: 'contract IConsensus',
                type: 'address',
            },
            { name: 'appOwner', internalType: 'address', type: 'address' },
            { name: 'templateHash', internalType: 'bytes32', type: 'bytes32' },
            { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'newApplication',
        outputs: [
            {
                name: '',
                internalType: 'contract IApplication',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: 'consensus',
                internalType: 'contract IConsensus',
                type: 'address',
            },
            { name: 'appOwner', internalType: 'address', type: 'address' },
            { name: 'templateHash', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'newApplication',
        outputs: [
            {
                name: '',
                internalType: 'contract IApplication',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
] as const

export const applicationFactoryAddress =
    '0x1d4CfBD2622d802A07CeB4C3401Bbb455c9dbdC3' as const

export const applicationFactoryConfig = {
    address: applicationFactoryAddress,
    abi: applicationFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AuthorityFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const authorityFactoryAbi = [
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'authority',
                internalType: 'contract IAuthority',
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
                name: 'authorityOwner',
                internalType: 'address',
                type: 'address',
            },
            { name: 'epochLength', internalType: 'uint256', type: 'uint256' },
            { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'calculateAuthorityAddress',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: 'authorityOwner',
                internalType: 'address',
                type: 'address',
            },
            { name: 'epochLength', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'newAuthority',
        outputs: [
            { name: '', internalType: 'contract IAuthority', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: 'authorityOwner',
                internalType: 'address',
                type: 'address',
            },
            { name: 'epochLength', internalType: 'uint256', type: 'uint256' },
            { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'newAuthority',
        outputs: [
            { name: '', internalType: 'contract IAuthority', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
] as const

export const authorityFactoryAddress =
    '0xB897F7Fe78f220aE34B7FA9493092701a873Ed45' as const

export const authorityFactoryConfig = {
    address: authorityFactoryAddress,
    abi: authorityFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC1155BatchPortal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1155BatchPortalAbi = [
    {
        type: 'constructor',
        inputs: [
            {
                name: 'inputBox',
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
                name: 'token',
                internalType: 'contract IERC1155',
                type: 'address',
            },
            { name: 'appContract', internalType: 'address', type: 'address' },
            { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
            { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
            { name: 'baseLayerData', internalType: 'bytes', type: 'bytes' },
            { name: 'execLayerData', internalType: 'bytes', type: 'bytes' },
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
    '0x4a218D331C0933d7E3EB496ac901669f28D94981' as const

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
                name: 'inputBox',
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
                name: 'token',
                internalType: 'contract IERC1155',
                type: 'address',
            },
            { name: 'appContract', internalType: 'address', type: 'address' },
            { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
            { name: 'baseLayerData', internalType: 'bytes', type: 'bytes' },
            { name: 'execLayerData', internalType: 'bytes', type: 'bytes' },
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
    '0x2f0D587DD6EcF67d25C558f2e9c3839c579e5e38' as const

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
                name: 'inputBox',
                internalType: 'contract IInputBox',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    { type: 'error', inputs: [], name: 'ERC20TransferFailed' },
    {
        type: 'function',
        inputs: [
            { name: 'token', internalType: 'contract IERC20', type: 'address' },
            { name: 'appContract', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
            { name: 'execLayerData', internalType: 'bytes', type: 'bytes' },
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
    '0xB0e28881FF7ee9CD5B1229d570540d74bce23D39' as const

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
                name: 'inputBox',
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
                name: 'token',
                internalType: 'contract IERC721',
                type: 'address',
            },
            { name: 'appContract', internalType: 'address', type: 'address' },
            { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
            { name: 'baseLayerData', internalType: 'bytes', type: 'bytes' },
            { name: 'execLayerData', internalType: 'bytes', type: 'bytes' },
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
    '0x874b3245ead7474Cb9f3b83cD1446dC522f6bd36' as const

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
                name: 'inputBox',
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
            { name: 'appContract', internalType: 'address', type: 'address' },
            { name: 'execLayerData', internalType: 'bytes', type: 'bytes' },
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
    '0xfa2292f6D85ea4e629B156A4f99219e30D12EE17' as const

export const etherPortalConfig = {
    address: etherPortalAddress,
    abi: etherPortalAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// InputBox
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const inputBoxAbi = [
    {
        type: 'error',
        inputs: [
            { name: 'appContract', internalType: 'address', type: 'address' },
            { name: 'inputLength', internalType: 'uint256', type: 'uint256' },
            {
                name: 'maxInputLength',
                internalType: 'uint256',
                type: 'uint256',
            },
        ],
        name: 'InputTooLarge',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'appContract',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'index',
                internalType: 'uint256',
                type: 'uint256',
                indexed: true,
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
            { name: 'appContract', internalType: 'address', type: 'address' },
            { name: 'payload', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'addInput',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'appContract', internalType: 'address', type: 'address' },
            { name: 'index', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'getInputHash',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'appContract', internalType: 'address', type: 'address' },
        ],
        name: 'getNumberOfInputs',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
] as const

export const inputBoxAddress =
    '0x593E5BCf894D6829Dd26D0810DA7F064406aebB6' as const

export const inputBoxConfig = {
    address: inputBoxAddress,
    abi: inputBoxAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// QuorumFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const quorumFactoryAbi = [
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'quorum',
                internalType: 'contract IQuorum',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'QuorumCreated',
    },
    {
        type: 'function',
        inputs: [
            {
                name: 'validators',
                internalType: 'address[]',
                type: 'address[]',
            },
            { name: 'epochLength', internalType: 'uint256', type: 'uint256' },
            { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'calculateQuorumAddress',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: 'validators',
                internalType: 'address[]',
                type: 'address[]',
            },
            { name: 'epochLength', internalType: 'uint256', type: 'uint256' },
            { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'newQuorum',
        outputs: [
            { name: '', internalType: 'contract IQuorum', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: 'validators',
                internalType: 'address[]',
                type: 'address[]',
            },
            { name: 'epochLength', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'newQuorum',
        outputs: [
            { name: '', internalType: 'contract IQuorum', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
] as const

export const quorumFactoryAddress =
    '0x22AFD9162079c7Ac0aF874054298Bf46F29157F1' as const

export const quorumFactoryConfig = {
    address: quorumFactoryAddress,
    abi: quorumFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SafeERC20Transfer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const safeErc20TransferAbi = [
    {
        type: 'error',
        inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
        name: 'AddressEmptyCode',
    },
    {
        type: 'error',
        inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
        name: 'AddressInsufficientBalance',
    },
    { type: 'error', inputs: [], name: 'FailedInnerCall' },
    {
        type: 'error',
        inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
        name: 'SafeERC20FailedOperation',
    },
    {
        type: 'function',
        inputs: [
            { name: 'token', internalType: 'contract IERC20', type: 'address' },
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'safeTransfer',
        outputs: [],
        stateMutability: 'nonpayable',
    },
] as const

export const safeErc20TransferAddress =
    '0x817b126F242B5F184Fa685b4f2F91DC99D8115F9' as const

export const safeErc20TransferConfig = {
    address: safeErc20TransferAddress,
    abi: safeErc20TransferAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SelfHostedApplicationFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const selfHostedApplicationFactoryAbi = [
    {
        type: 'constructor',
        inputs: [
            {
                name: 'authorityFactory',
                internalType: 'contract IAuthorityFactory',
                type: 'address',
            },
            {
                name: 'applicationFactory',
                internalType: 'contract IApplicationFactory',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: 'authorityOwner',
                internalType: 'address',
                type: 'address',
            },
            { name: 'epochLength', internalType: 'uint256', type: 'uint256' },
            { name: 'appOwner', internalType: 'address', type: 'address' },
            { name: 'templateHash', internalType: 'bytes32', type: 'bytes32' },
            { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'calculateAddresses',
        outputs: [
            { name: 'application', internalType: 'address', type: 'address' },
            { name: 'authority', internalType: 'address', type: 'address' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: 'authorityOwner',
                internalType: 'address',
                type: 'address',
            },
            { name: 'epochLength', internalType: 'uint256', type: 'uint256' },
            { name: 'appOwner', internalType: 'address', type: 'address' },
            { name: 'templateHash', internalType: 'bytes32', type: 'bytes32' },
            { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'deployContracts',
        outputs: [
            {
                name: 'application',
                internalType: 'contract IApplication',
                type: 'address',
            },
            {
                name: 'authority',
                internalType: 'contract IAuthority',
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
                internalType: 'contract IApplicationFactory',
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
] as const

export const selfHostedApplicationFactoryAddress =
    '0x4C11C7F82D6D56a726f9B53dd99af031AFd86BB6' as const

export const selfHostedApplicationFactoryConfig = {
    address: selfHostedApplicationFactoryAddress,
    abi: selfHostedApplicationFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TestMultiToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const testMultiTokenAbi = [
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

export const testMultiTokenAddress =
    '0x04d724738873CB6a86328D2EbAEb2079D715e61e' as const

export const testMultiTokenConfig = {
    address: testMultiTokenAddress,
    abi: testMultiTokenAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TestNFT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const testNftAbi = [
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

export const testNftAddress =
    '0xc6582A9b48F211Fa8c2B5b16CB615eC39bcA653B' as const

export const testNftConfig = {
    address: testNftAddress,
    abi: testNftAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TestToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const testTokenAbi = [
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

export const testTokenAddress =
    '0x92C6bcA388E99d6B304f1Af3c3Cd749Ff0b591e2' as const

export const testTokenConfig = {
    address: testTokenAddress,
    abi: testTokenAbi,
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link applicationFactoryAbi}__
 */
export const useReadApplicationFactory = /*#__PURE__*/ createUseReadContract({
    abi: applicationFactoryAbi,
    address: applicationFactoryAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link applicationFactoryAbi}__ and `functionName` set to `"calculateApplicationAddress"`
 */
export const useReadApplicationFactoryCalculateApplicationAddress =
    /*#__PURE__*/ createUseReadContract({
        abi: applicationFactoryAbi,
        address: applicationFactoryAddress,
        functionName: 'calculateApplicationAddress',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link applicationFactoryAbi}__
 */
export const useWriteApplicationFactory = /*#__PURE__*/ createUseWriteContract({
    abi: applicationFactoryAbi,
    address: applicationFactoryAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link applicationFactoryAbi}__ and `functionName` set to `"newApplication"`
 */
export const useWriteApplicationFactoryNewApplication =
    /*#__PURE__*/ createUseWriteContract({
        abi: applicationFactoryAbi,
        address: applicationFactoryAddress,
        functionName: 'newApplication',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link applicationFactoryAbi}__
 */
export const useSimulateApplicationFactory =
    /*#__PURE__*/ createUseSimulateContract({
        abi: applicationFactoryAbi,
        address: applicationFactoryAddress,
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link applicationFactoryAbi}__ and `functionName` set to `"newApplication"`
 */
export const useSimulateApplicationFactoryNewApplication =
    /*#__PURE__*/ createUseSimulateContract({
        abi: applicationFactoryAbi,
        address: applicationFactoryAddress,
        functionName: 'newApplication',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link applicationFactoryAbi}__
 */
export const useWatchApplicationFactoryEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: applicationFactoryAbi,
        address: applicationFactoryAddress,
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link applicationFactoryAbi}__ and `eventName` set to `"ApplicationCreated"`
 */
export const useWatchApplicationFactoryApplicationCreatedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: applicationFactoryAbi,
        address: applicationFactoryAddress,
        eventName: 'ApplicationCreated',
    })

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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link quorumFactoryAbi}__
 */
export const useReadQuorumFactory = /*#__PURE__*/ createUseReadContract({
    abi: quorumFactoryAbi,
    address: quorumFactoryAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link quorumFactoryAbi}__ and `functionName` set to `"calculateQuorumAddress"`
 */
export const useReadQuorumFactoryCalculateQuorumAddress =
    /*#__PURE__*/ createUseReadContract({
        abi: quorumFactoryAbi,
        address: quorumFactoryAddress,
        functionName: 'calculateQuorumAddress',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link quorumFactoryAbi}__
 */
export const useWriteQuorumFactory = /*#__PURE__*/ createUseWriteContract({
    abi: quorumFactoryAbi,
    address: quorumFactoryAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link quorumFactoryAbi}__ and `functionName` set to `"newQuorum"`
 */
export const useWriteQuorumFactoryNewQuorum =
    /*#__PURE__*/ createUseWriteContract({
        abi: quorumFactoryAbi,
        address: quorumFactoryAddress,
        functionName: 'newQuorum',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link quorumFactoryAbi}__
 */
export const useSimulateQuorumFactory = /*#__PURE__*/ createUseSimulateContract(
    { abi: quorumFactoryAbi, address: quorumFactoryAddress },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link quorumFactoryAbi}__ and `functionName` set to `"newQuorum"`
 */
export const useSimulateQuorumFactoryNewQuorum =
    /*#__PURE__*/ createUseSimulateContract({
        abi: quorumFactoryAbi,
        address: quorumFactoryAddress,
        functionName: 'newQuorum',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link quorumFactoryAbi}__
 */
export const useWatchQuorumFactoryEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: quorumFactoryAbi,
        address: quorumFactoryAddress,
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link quorumFactoryAbi}__ and `eventName` set to `"QuorumCreated"`
 */
export const useWatchQuorumFactoryQuorumCreatedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: quorumFactoryAbi,
        address: quorumFactoryAddress,
        eventName: 'QuorumCreated',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link safeErc20TransferAbi}__
 */
export const useWriteSafeErc20Transfer = /*#__PURE__*/ createUseWriteContract({
    abi: safeErc20TransferAbi,
    address: safeErc20TransferAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link safeErc20TransferAbi}__ and `functionName` set to `"safeTransfer"`
 */
export const useWriteSafeErc20TransferSafeTransfer =
    /*#__PURE__*/ createUseWriteContract({
        abi: safeErc20TransferAbi,
        address: safeErc20TransferAddress,
        functionName: 'safeTransfer',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link safeErc20TransferAbi}__
 */
export const useSimulateSafeErc20Transfer =
    /*#__PURE__*/ createUseSimulateContract({
        abi: safeErc20TransferAbi,
        address: safeErc20TransferAddress,
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link safeErc20TransferAbi}__ and `functionName` set to `"safeTransfer"`
 */
export const useSimulateSafeErc20TransferSafeTransfer =
    /*#__PURE__*/ createUseSimulateContract({
        abi: safeErc20TransferAbi,
        address: safeErc20TransferAddress,
        functionName: 'safeTransfer',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link selfHostedApplicationFactoryAbi}__ and `functionName` set to `"getAuthorityFactory"`
 */
export const useReadSelfHostedApplicationFactoryGetAuthorityFactory =
    /*#__PURE__*/ createUseReadContract({
        abi: selfHostedApplicationFactoryAbi,
        address: selfHostedApplicationFactoryAddress,
        functionName: 'getAuthorityFactory',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testMultiTokenAbi}__
 */
export const useReadTestMultiToken = /*#__PURE__*/ createUseReadContract({
    abi: testMultiTokenAbi,
    address: testMultiTokenAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadTestMultiTokenBalanceOf =
    /*#__PURE__*/ createUseReadContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'balanceOf',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadTestMultiTokenBalanceOfBatch =
    /*#__PURE__*/ createUseReadContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'balanceOfBatch',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadTestMultiTokenIsApprovedForAll =
    /*#__PURE__*/ createUseReadContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'isApprovedForAll',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"owner"`
 */
export const useReadTestMultiTokenOwner = /*#__PURE__*/ createUseReadContract({
    abi: testMultiTokenAbi,
    address: testMultiTokenAddress,
    functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadTestMultiTokenSupportsInterface =
    /*#__PURE__*/ createUseReadContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'supportsInterface',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"uri"`
 */
export const useReadTestMultiTokenUri = /*#__PURE__*/ createUseReadContract({
    abi: testMultiTokenAbi,
    address: testMultiTokenAddress,
    functionName: 'uri',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testMultiTokenAbi}__
 */
export const useWriteTestMultiToken = /*#__PURE__*/ createUseWriteContract({
    abi: testMultiTokenAbi,
    address: testMultiTokenAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteTestMultiTokenMint = /*#__PURE__*/ createUseWriteContract({
    abi: testMultiTokenAbi,
    address: testMultiTokenAddress,
    functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"mintBatch"`
 */
export const useWriteTestMultiTokenMintBatch =
    /*#__PURE__*/ createUseWriteContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'mintBatch',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteTestMultiTokenRenounceOwnership =
    /*#__PURE__*/ createUseWriteContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'renounceOwnership',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteTestMultiTokenSafeBatchTransferFrom =
    /*#__PURE__*/ createUseWriteContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'safeBatchTransferFrom',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteTestMultiTokenSafeTransferFrom =
    /*#__PURE__*/ createUseWriteContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'safeTransferFrom',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteTestMultiTokenSetApprovalForAll =
    /*#__PURE__*/ createUseWriteContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'setApprovalForAll',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"setURI"`
 */
export const useWriteTestMultiTokenSetUri =
    /*#__PURE__*/ createUseWriteContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'setURI',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteTestMultiTokenTransferOwnership =
    /*#__PURE__*/ createUseWriteContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'transferOwnership',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testMultiTokenAbi}__
 */
export const useSimulateTestMultiToken =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateTestMultiTokenMint =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'mint',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"mintBatch"`
 */
export const useSimulateTestMultiTokenMintBatch =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'mintBatch',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateTestMultiTokenRenounceOwnership =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'renounceOwnership',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateTestMultiTokenSafeBatchTransferFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'safeBatchTransferFrom',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateTestMultiTokenSafeTransferFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'safeTransferFrom',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateTestMultiTokenSetApprovalForAll =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'setApprovalForAll',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"setURI"`
 */
export const useSimulateTestMultiTokenSetUri =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'setURI',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testMultiTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateTestMultiTokenTransferOwnership =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        functionName: 'transferOwnership',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testMultiTokenAbi}__
 */
export const useWatchTestMultiTokenEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testMultiTokenAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchTestMultiTokenApprovalForAllEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        eventName: 'ApprovalForAll',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testMultiTokenAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchTestMultiTokenOwnershipTransferredEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        eventName: 'OwnershipTransferred',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testMultiTokenAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchTestMultiTokenTransferBatchEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        eventName: 'TransferBatch',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testMultiTokenAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchTestMultiTokenTransferSingleEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        eventName: 'TransferSingle',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testMultiTokenAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchTestMultiTokenUriEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testMultiTokenAbi,
        address: testMultiTokenAddress,
        eventName: 'URI',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testNftAbi}__
 */
export const useReadTestNft = /*#__PURE__*/ createUseReadContract({
    abi: testNftAbi,
    address: testNftAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadTestNftBalanceOf = /*#__PURE__*/ createUseReadContract({
    abi: testNftAbi,
    address: testNftAddress,
    functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadTestNftGetApproved = /*#__PURE__*/ createUseReadContract({
    abi: testNftAbi,
    address: testNftAddress,
    functionName: 'getApproved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadTestNftIsApprovedForAll =
    /*#__PURE__*/ createUseReadContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'isApprovedForAll',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"name"`
 */
export const useReadTestNftName = /*#__PURE__*/ createUseReadContract({
    abi: testNftAbi,
    address: testNftAddress,
    functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"owner"`
 */
export const useReadTestNftOwner = /*#__PURE__*/ createUseReadContract({
    abi: testNftAbi,
    address: testNftAddress,
    functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadTestNftOwnerOf = /*#__PURE__*/ createUseReadContract({
    abi: testNftAbi,
    address: testNftAddress,
    functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadTestNftSupportsInterface =
    /*#__PURE__*/ createUseReadContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'supportsInterface',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadTestNftSymbol = /*#__PURE__*/ createUseReadContract({
    abi: testNftAbi,
    address: testNftAddress,
    functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadTestNftTokenUri = /*#__PURE__*/ createUseReadContract({
    abi: testNftAbi,
    address: testNftAddress,
    functionName: 'tokenURI',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testNftAbi}__
 */
export const useWriteTestNft = /*#__PURE__*/ createUseWriteContract({
    abi: testNftAbi,
    address: testNftAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteTestNftApprove = /*#__PURE__*/ createUseWriteContract({
    abi: testNftAbi,
    address: testNftAddress,
    functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteTestNftRenounceOwnership =
    /*#__PURE__*/ createUseWriteContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'renounceOwnership',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"safeMint"`
 */
export const useWriteTestNftSafeMint = /*#__PURE__*/ createUseWriteContract({
    abi: testNftAbi,
    address: testNftAddress,
    functionName: 'safeMint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteTestNftSafeTransferFrom =
    /*#__PURE__*/ createUseWriteContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'safeTransferFrom',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteTestNftSetApprovalForAll =
    /*#__PURE__*/ createUseWriteContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'setApprovalForAll',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteTestNftTransferFrom = /*#__PURE__*/ createUseWriteContract(
    { abi: testNftAbi, address: testNftAddress, functionName: 'transferFrom' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteTestNftTransferOwnership =
    /*#__PURE__*/ createUseWriteContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'transferOwnership',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testNftAbi}__
 */
export const useSimulateTestNft = /*#__PURE__*/ createUseSimulateContract({
    abi: testNftAbi,
    address: testNftAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateTestNftApprove =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'approve',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateTestNftRenounceOwnership =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'renounceOwnership',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"safeMint"`
 */
export const useSimulateTestNftSafeMint =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'safeMint',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateTestNftSafeTransferFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'safeTransferFrom',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateTestNftSetApprovalForAll =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'setApprovalForAll',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateTestNftTransferFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'transferFrom',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testNftAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateTestNftTransferOwnership =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testNftAbi,
        address: testNftAddress,
        functionName: 'transferOwnership',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testNftAbi}__
 */
export const useWatchTestNftEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: testNftAbi,
    address: testNftAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testNftAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchTestNftApprovalEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testNftAbi,
        address: testNftAddress,
        eventName: 'Approval',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testNftAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchTestNftApprovalForAllEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testNftAbi,
        address: testNftAddress,
        eventName: 'ApprovalForAll',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testNftAbi}__ and `eventName` set to `"BatchMetadataUpdate"`
 */
export const useWatchTestNftBatchMetadataUpdateEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testNftAbi,
        address: testNftAddress,
        eventName: 'BatchMetadataUpdate',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testNftAbi}__ and `eventName` set to `"MetadataUpdate"`
 */
export const useWatchTestNftMetadataUpdateEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testNftAbi,
        address: testNftAddress,
        eventName: 'MetadataUpdate',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testNftAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchTestNftOwnershipTransferredEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testNftAbi,
        address: testNftAddress,
        eventName: 'OwnershipTransferred',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testNftAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchTestNftTransferEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testNftAbi,
        address: testNftAddress,
        eventName: 'Transfer',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__
 */
export const useReadTestToken = /*#__PURE__*/ createUseReadContract({
    abi: testTokenAbi,
    address: testTokenAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadTestTokenDomainSeparator =
    /*#__PURE__*/ createUseReadContract({
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'DOMAIN_SEPARATOR',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadTestTokenAllowance = /*#__PURE__*/ createUseReadContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"authority"`
 */
export const useReadTestTokenAuthority = /*#__PURE__*/ createUseReadContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'authority',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadTestTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadTestTokenDecimals = /*#__PURE__*/ createUseReadContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useReadTestTokenEip712Domain = /*#__PURE__*/ createUseReadContract(
    {
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'eip712Domain',
    },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"isConsumingScheduledOp"`
 */
export const useReadTestTokenIsConsumingScheduledOp =
    /*#__PURE__*/ createUseReadContract({
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'isConsumingScheduledOp',
    })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadTestTokenName = /*#__PURE__*/ createUseReadContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"nonces"`
 */
export const useReadTestTokenNonces = /*#__PURE__*/ createUseReadContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'nonces',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"paused"`
 */
export const useReadTestTokenPaused = /*#__PURE__*/ createUseReadContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadTestTokenSymbol = /*#__PURE__*/ createUseReadContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadTestTokenTotalSupply = /*#__PURE__*/ createUseReadContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testTokenAbi}__
 */
export const useWriteTestToken = /*#__PURE__*/ createUseWriteContract({
    abi: testTokenAbi,
    address: testTokenAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteTestTokenApprove = /*#__PURE__*/ createUseWriteContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteTestTokenBurn = /*#__PURE__*/ createUseWriteContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useWriteTestTokenBurnFrom = /*#__PURE__*/ createUseWriteContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'burnFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"pause"`
 */
export const useWriteTestTokenPause = /*#__PURE__*/ createUseWriteContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"permit"`
 */
export const useWriteTestTokenPermit = /*#__PURE__*/ createUseWriteContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'permit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useWriteTestTokenSetAuthority =
    /*#__PURE__*/ createUseWriteContract({
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'setAuthority',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteTestTokenTransfer = /*#__PURE__*/ createUseWriteContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteTestTokenTransferFrom =
    /*#__PURE__*/ createUseWriteContract({
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'transferFrom',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"unpause"`
 */
export const useWriteTestTokenUnpause = /*#__PURE__*/ createUseWriteContract({
    abi: testTokenAbi,
    address: testTokenAddress,
    functionName: 'unpause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testTokenAbi}__
 */
export const useSimulateTestToken = /*#__PURE__*/ createUseSimulateContract({
    abi: testTokenAbi,
    address: testTokenAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateTestTokenApprove =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'approve',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateTestTokenBurn = /*#__PURE__*/ createUseSimulateContract(
    { abi: testTokenAbi, address: testTokenAddress, functionName: 'burn' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useSimulateTestTokenBurnFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'burnFrom',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"pause"`
 */
export const useSimulateTestTokenPause =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'pause',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"permit"`
 */
export const useSimulateTestTokenPermit =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'permit',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useSimulateTestTokenSetAuthority =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'setAuthority',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateTestTokenTransfer =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'transfer',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateTestTokenTransferFrom =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'transferFrom',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link testTokenAbi}__ and `functionName` set to `"unpause"`
 */
export const useSimulateTestTokenUnpause =
    /*#__PURE__*/ createUseSimulateContract({
        abi: testTokenAbi,
        address: testTokenAddress,
        functionName: 'unpause',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testTokenAbi}__
 */
export const useWatchTestTokenEvent = /*#__PURE__*/ createUseWatchContractEvent(
    { abi: testTokenAbi, address: testTokenAddress },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchTestTokenApprovalEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testTokenAbi,
        address: testTokenAddress,
        eventName: 'Approval',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testTokenAbi}__ and `eventName` set to `"AuthorityUpdated"`
 */
export const useWatchTestTokenAuthorityUpdatedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testTokenAbi,
        address: testTokenAddress,
        eventName: 'AuthorityUpdated',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testTokenAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useWatchTestTokenEip712DomainChangedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testTokenAbi,
        address: testTokenAddress,
        eventName: 'EIP712DomainChanged',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testTokenAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchTestTokenPausedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testTokenAbi,
        address: testTokenAddress,
        eventName: 'Paused',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchTestTokenTransferEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testTokenAbi,
        address: testTokenAddress,
        eventName: 'Transfer',
    })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link testTokenAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchTestTokenUnpausedEvent =
    /*#__PURE__*/ createUseWatchContractEvent({
        abi: testTokenAbi,
        address: testTokenAddress,
        eventName: 'Unpaused',
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
