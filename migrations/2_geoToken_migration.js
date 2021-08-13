const GeoToken = artifacts.require('GeoToken');

require('@openzeppelin/test-helpers/configure')({ provider: web3.currentProvider, environment: 'truffle' });


module.exports = async function (deployer, network, accounts) {

  await deployer.deploy(GeoToken, { from: accounts[0] });
  const contract = await GeoToken.deployed();
};