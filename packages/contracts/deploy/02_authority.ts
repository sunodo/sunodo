import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployOptions } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, ethers, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();

    const opts: DeployOptions = {
        deterministicDeployment: true,
        from: deployer,
        log: true,
    };

    const { InputBox } = await deployments.all();

    const AuthorityFactory = await deployments.deploy("AuthorityFactory", {
        ...opts,
        args: [InputBox.address],
    });
    const HistoryFactory = await deployments.deploy("HistoryFactory", opts);

    await deployments.deploy("AuthorityHistoryPairFactory", {
        ...opts,
        args: [AuthorityFactory.address, HistoryFactory.address],
    });
};
export default func;
