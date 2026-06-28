import {
    createUseWriteContract,
    createUseSimulateContract,
    createUseReadContract,
    createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// dataAvailability
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dataAvailabilityAbi = [
    {
        type: 'function',
        inputs: [
            {
                name: 'inputBox',
                internalType: 'contract IInputBox',
                type: 'address',
            },
        ],
        name: 'InputBox',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: 'inputBox',
                internalType: 'contract IInputBox',
                type: 'address',
            },
            { name: 'fromBlock', internalType: 'uint256', type: 'uint256' },
            { name: 'namespaceId', internalType: 'uint32', type: 'uint32' },
        ],
        name: 'InputBoxAndEspresso',
        outputs: [],
        stateMutability: 'nonpayable',
    },
] as const

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
// inputBox
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const inputBoxAbi = [
    {
        type: 'function',
        inputs: [
            { name: 'appContract', internalType: 'address', type: 'address' },
            { name: 'payload', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'addInput',
        outputs: [
            { name: 'inputHash', internalType: 'bytes32', type: 'bytes32' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'getDeploymentBlockNumber',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
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
    {
        type: 'function',
        inputs: [],
        name: 'version',
        outputs: [
            { name: 'major', internalType: 'uint64', type: 'uint64' },
            { name: 'minor', internalType: 'uint64', type: 'uint64' },
            { name: 'patch', internalType: 'uint64', type: 'uint64' },
            { name: 'preRelease', internalType: 'string', type: 'string' },
            { name: 'buildMetadata', internalType: 'string', type: 'string' },
        ],
        stateMutability: 'pure',
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
        type: 'error',
        inputs: [
            { name: 'appContract', internalType: 'address', type: 'address' },
        ],
        name: 'ApplicationForeclosed',
    },
    {
        type: 'error',
        inputs: [
            { name: 'appContract', internalType: 'address', type: 'address' },
        ],
        name: 'ApplicationNotDeployed',
    },
    {
        type: 'error',
        inputs: [
            { name: 'appContract', internalType: 'address', type: 'address' },
            { name: 'error', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'ApplicationReverted',
    },
    {
        type: 'error',
        inputs: [
            { name: 'appContract', internalType: 'address', type: 'address' },
            { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'IllformedApplicationReturnData',
    },
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
] as const

export const inputBoxAddress =
    '0x346B3df038FE9f8380071eC6514D5a83aD143939' as const

export const inputBoxConfig = {
    address: inputBoxAddress,
    abi: inputBoxAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// selfHostedApplicationFactory
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
            {
                name: 'claimStagingPeriod',
                internalType: 'uint256',
                type: 'uint256',
            },
            { name: 'appOwner', internalType: 'address', type: 'address' },
            { name: 'templateHash', internalType: 'bytes32', type: 'bytes32' },
            { name: 'dataAvailability', internalType: 'bytes', type: 'bytes' },
            {
                name: 'withdrawalConfig',
                internalType: 'struct WithdrawalConfig',
                type: 'tuple',
                components: [
                    {
                        name: 'guardian',
                        internalType: 'address',
                        type: 'address',
                    },
                    {
                        name: 'log2LeavesPerAccount',
                        internalType: 'uint8',
                        type: 'uint8',
                    },
                    {
                        name: 'log2MaxNumOfAccounts',
                        internalType: 'uint8',
                        type: 'uint8',
                    },
                    {
                        name: 'accountsDriveStartIndex',
                        internalType: 'uint64',
                        type: 'uint64',
                    },
                    {
                        name: 'withdrawalOutputBuilder',
                        internalType: 'contract IWithdrawalOutputBuilder',
                        type: 'address',
                    },
                ],
            },
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
            {
                name: 'claimStagingPeriod',
                internalType: 'uint256',
                type: 'uint256',
            },
            { name: 'appOwner', internalType: 'address', type: 'address' },
            { name: 'templateHash', internalType: 'bytes32', type: 'bytes32' },
            { name: 'dataAvailability', internalType: 'bytes', type: 'bytes' },
            {
                name: 'withdrawalConfig',
                internalType: 'struct WithdrawalConfig',
                type: 'tuple',
                components: [
                    {
                        name: 'guardian',
                        internalType: 'address',
                        type: 'address',
                    },
                    {
                        name: 'log2LeavesPerAccount',
                        internalType: 'uint8',
                        type: 'uint8',
                    },
                    {
                        name: 'log2MaxNumOfAccounts',
                        internalType: 'uint8',
                        type: 'uint8',
                    },
                    {
                        name: 'accountsDriveStartIndex',
                        internalType: 'uint64',
                        type: 'uint64',
                    },
                    {
                        name: 'withdrawalOutputBuilder',
                        internalType: 'contract IWithdrawalOutputBuilder',
                        type: 'address',
                    },
                ],
            },
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
    {
        type: 'function',
        inputs: [],
        name: 'version',
        outputs: [
            { name: 'major', internalType: 'uint64', type: 'uint64' },
            { name: 'minor', internalType: 'uint64', type: 'uint64' },
            { name: 'patch', internalType: 'uint64', type: 'uint64' },
            { name: 'preRelease', internalType: 'string', type: 'string' },
            { name: 'buildMetadata', internalType: 'string', type: 'string' },
        ],
        stateMutability: 'pure',
    },
    {
        type: 'error',
        inputs: [
            {
                name: 'withdrawalConfig',
                internalType: 'struct WithdrawalConfig',
                type: 'tuple',
                components: [
                    {
                        name: 'guardian',
                        internalType: 'address',
                        type: 'address',
                    },
                    {
                        name: 'log2LeavesPerAccount',
                        internalType: 'uint8',
                        type: 'uint8',
                    },
                    {
                        name: 'log2MaxNumOfAccounts',
                        internalType: 'uint8',
                        type: 'uint8',
                    },
                    {
                        name: 'accountsDriveStartIndex',
                        internalType: 'uint64',
                        type: 'uint64',
                    },
                    {
                        name: 'withdrawalOutputBuilder',
                        internalType: 'contract IWithdrawalOutputBuilder',
                        type: 'address',
                    },
                ],
            },
        ],
        name: 'InvalidWithdrawalConfig',
    },
    { type: 'error', inputs: [], name: 'ZeroEpochLength' },
] as const

export const selfHostedApplicationFactoryAddress =
    '0x6145C5996a71a379E030aEb0440df79D60833418' as const

export const selfHostedApplicationFactoryConfig = {
    address: selfHostedApplicationFactoryAddress,
    abi: selfHostedApplicationFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dataAvailabilityAbi}__
 */
export const useWriteDataAvailability = /*#__PURE__*/ createUseWriteContract({
    abi: dataAvailabilityAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dataAvailabilityAbi}__ and `functionName` set to `"InputBox"`
 */
export const useWriteDataAvailabilityInputBox =
    /*#__PURE__*/ createUseWriteContract({
        abi: dataAvailabilityAbi,
        functionName: 'InputBox',
    })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dataAvailabilityAbi}__ and `functionName` set to `"InputBoxAndEspresso"`
 */
export const useWriteDataAvailabilityInputBoxAndEspresso =
    /*#__PURE__*/ createUseWriteContract({
        abi: dataAvailabilityAbi,
        functionName: 'InputBoxAndEspresso',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dataAvailabilityAbi}__
 */
export const useSimulateDataAvailability =
    /*#__PURE__*/ createUseSimulateContract({ abi: dataAvailabilityAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dataAvailabilityAbi}__ and `functionName` set to `"InputBox"`
 */
export const useSimulateDataAvailabilityInputBox =
    /*#__PURE__*/ createUseSimulateContract({
        abi: dataAvailabilityAbi,
        functionName: 'InputBox',
    })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dataAvailabilityAbi}__ and `functionName` set to `"InputBoxAndEspresso"`
 */
export const useSimulateDataAvailabilityInputBoxAndEspresso =
    /*#__PURE__*/ createUseSimulateContract({
        abi: dataAvailabilityAbi,
        functionName: 'InputBoxAndEspresso',
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

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link inputBoxAbi}__
 */
export const useReadInputBox = /*#__PURE__*/ createUseReadContract({
    abi: inputBoxAbi,
    address: inputBoxAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link inputBoxAbi}__ and `functionName` set to `"getDeploymentBlockNumber"`
 */
export const useReadInputBoxGetDeploymentBlockNumber =
    /*#__PURE__*/ createUseReadContract({
        abi: inputBoxAbi,
        address: inputBoxAddress,
        functionName: 'getDeploymentBlockNumber',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link inputBoxAbi}__ and `functionName` set to `"version"`
 */
export const useReadInputBoxVersion = /*#__PURE__*/ createUseReadContract({
    abi: inputBoxAbi,
    address: inputBoxAddress,
    functionName: 'version',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link selfHostedApplicationFactoryAbi}__ and `functionName` set to `"version"`
 */
export const useReadSelfHostedApplicationFactoryVersion =
    /*#__PURE__*/ createUseReadContract({
        abi: selfHostedApplicationFactoryAbi,
        address: selfHostedApplicationFactoryAddress,
        functionName: 'version',
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
