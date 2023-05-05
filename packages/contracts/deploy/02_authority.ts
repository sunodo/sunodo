import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployOptions } from "hardhat-deploy/types";
import { Authority__factory } from "@cartesi/rollups";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, ethers, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.getSigner(deployer);

    const opts: DeployOptions = {
        deterministicDeployment: true,
        from: deployer,
        log: true,
    };

    const { InputBox } = await deployments.all();

    const Authority = await deployments.deploy("SunodoAuthority", {
        ...opts,
        contract: "Authority",
        args: [deployer, InputBox.address],
    });

    /*
    const Authority = await deployments.deploy("SunodoAuthority", {
        ...opts,
        contract: "RoleBasedAuthority",
        args: [deployer, InputBox.address, History.address],
    });
    */

    const History = await deployments.deploy("SunodoHistory", {
        ...opts,
        contract: "History",
        args: [Authority.address],
    });

    const authority = Authority__factory.connect(Authority.address, signer);
    const currentHistory = await authority.getHistory();
    if (currentHistory != History.address) {
        const tx = await authority.setHistory(History.address);
        const receipt = await tx.wait();
        if (receipt.status == 0) {
            throw Error(`Could not link Authority to history: ${tx.hash}`);
        }
    }
};
export default func;
