// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const name = 'DMagic';
  const symbol = 'DMAGIC';
  const vrfCoordinator = '0x6168499c0cffcacd319c818142124b7a15e857ab';
  const keyHash =
    '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc';
  const subscriptionId = 1243;

  await deploy('DMagic', {
    from: deployer,
    args: [name, symbol, vrfCoordinator, keyHash, subscriptionId],
    log: true,
  });
};

func.tags = ['DMagic'];
module.exports = func;
