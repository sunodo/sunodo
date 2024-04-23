import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy("TestNFT", {
        from: deployer,
        args: [deployer],
        deterministicDeployment: true,
        log: true,
    });
};

func.tags = ["NFT"];
export default func;
