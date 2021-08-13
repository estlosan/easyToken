
const GeoToken = artifacts.require('GeoToken')
const EasyToken = artifacts.require('EasyToken')
const Operator = artifacts.require('Operator')

module.exports = async function (deployer, network, accounts) {

    let geoTokenContract = await GeoToken.deployed();
    let easyTokenContract = await EasyToken.deployed();
    let operatorContract = await Operator.deployed();

    await easyTokenContract.setToken(geoTokenContract.address, { from: accounts[0] });
    await operatorContract.setToken(easyTokenContract.address, { from: accounts[0] });
  
};