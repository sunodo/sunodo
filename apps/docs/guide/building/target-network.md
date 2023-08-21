# Target network

It is currently expected that the application code should be compatible with any supported network, meaning the application logic should not depend on the network it is running on.

The Cartesi rollups framework uses deterministic deployment for its smart contracts, which makes all smart contracts of the framework have the same address on all supported networks, including local devnet. This helps to make the application logic not network dependent.

If the application code still needs to know which network it is running on, this information should come from a trusted input and be processed by the application.
