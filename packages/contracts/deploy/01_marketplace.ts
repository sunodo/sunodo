import { deployENS } from "@ethereum-waffle/ens";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DeployFunction, DeployOptions } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployEns = async (deployer: SignerWithAddress) => {
    const ens = await deployENS(deployer);
    await ens.createTopLevelDomain("test");
    return ens.ens.address;
};

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, ethers, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    const [deployerSigner] = await ethers.getSigners();

    const opts: DeployOptions = {
        deterministicDeployment: true,
        from: deployer,
        log: true,
    };

    const provider = ethers.getDefaultProvider();
    const ensAddress = provider.network.ensAddress || deployEns(deployerSigner);

    // deploy the wrapper around the CartesiDAppFactory that includes machine IPFS hash
    const { CartesiDAppFactory } = await deployments.all();

    // deploy the factory of of payable deploys using ERC-20
    await deployments.deploy("Marketplace", {
        ...opts,
        args: [ensAddress, CartesiDAppFactory.address],
    });
};
export default func;
