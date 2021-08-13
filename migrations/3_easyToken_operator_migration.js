const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const EasyToken = artifacts.require('EasyToken');
const Operator = artifacts.require('Operator');

require('@openzeppelin/test-helpers/configure')({ provider: web3.currentProvider, environment: 'truffle' });

const { singletons } = require('@openzeppelin/test-helpers');

module.exports = async function (deployer, network, accounts) {
  if (network === 'test' || network === 'advanced') {
    // In a test environment an ERC777 token requires deploying an ERC1820 registry
    await singletons.ERC1820Registry(accounts[0]);
  }

  await deployer.deploy(Operator, { from: accounts[0] })
  let operator = await Operator.deployed();
  let operatorAddr = [operator.address];
  const contract = await deployProxy(EasyToken, [operatorAddr], { from: accounts[0] });
  
  console.log('Deployed', contract.address);

};