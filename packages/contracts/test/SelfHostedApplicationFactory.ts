import { expect } from "chai";
import hre from "hardhat";
import { Address, getAddress, parseEventLogs, zeroHash } from "viem";

describe("SelfHostedApplicationFactory", () => {
    it("calculateApplicationAddress", async () => {
        const { deployments, getNamedAccounts, viem } = hre;
        await deployments.fixture();

        const { SelfHostedApplicationFactory } = await deployments.all();
        const { deployer } = await getNamedAccounts();
        const contract = await viem.getContractAt(
            "SelfHostedApplicationFactory",
            SelfHostedApplicationFactory.address as Address,
        );

        const authorityOwner = deployer as Address;
        const dappOwner = deployer as Address;
        const templateHash = zeroHash;
        const salt = zeroHash;

        const [authorityAddress, historyAddress, applicationAddress] =
            await contract.read.calculateApplicationAddress([
                authorityOwner,
                dappOwner,
                templateHash,
                salt,
            ]);

        expect(authorityAddress).equal(
            getAddress("0x58c93f83fb3304730c95aad2e360cdb88b782010"),
        );
        expect(historyAddress).equal(
            getAddress("0x325272217ae6815b494bf38ced004c5eb8a7cda7"),
        );
        expect(applicationAddress).equal(
            getAddress("0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e"),
        );
    });

    it("newApplication", async () => {
        const { deployments, getNamedAccounts, viem } = hre;
        await deployments.fixture();

        const { CartesiDAppFactory, SelfHostedApplicationFactory } =
            await deployments.all();
        const { deployer } = await getNamedAccounts();
        const contract = await viem.getContractAt(
            "SelfHostedApplicationFactory",
            SelfHostedApplicationFactory.address as Address,
        );

        const authorityOwner = deployer as Address;
        const dappOwner = deployer as Address;
        const templateHash = zeroHash;
        const salt = zeroHash;

        const hash = await contract.write.newApplication([
            authorityOwner,
            dappOwner,
            templateHash,
            salt,
        ]);
        const publicClient = await viem.getPublicClient();
        const factory = await viem.getContractAt(
            "CartesiDAppFactory",
            CartesiDAppFactory.address as Address,
        );
        const { logs } = await publicClient.waitForTransactionReceipt({ hash });

        // get application address from event log, and compare
        const parsedLogs = parseEventLogs({
            abi: factory.abi,
            logs,
            eventName: "ApplicationCreated",
        });
        const applicationAddress = parsedLogs.reduce<Address | undefined>(
            (_, log) => log.args.application,
            undefined,
        );

        expect(applicationAddress).equal(
            getAddress("0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e"),
        );
    });
});
