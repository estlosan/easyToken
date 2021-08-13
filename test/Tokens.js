require('@openzeppelin/test-helpers/configure')({
    environment: 'truffle',
    provider: web3.currentProvider,
  });
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');


const GeoToken = artifacts.require('./GeoToken.sol');
const EasyToken = artifacts.require('./EasyToken.sol');
const Operator = artifacts.require('./Operator.sol');
const EasyTokenV2 = artifacts.require('./test/EasyTokenV2.sol');

const {
BN,
expectRevert,
expectEvent,
time,
} = require('@openzeppelin/test-helpers');
const { assert } = require('chai');

contract('Tokens', ([owner, app, user, operator, ...accounts]) => {
    let geoTokenContract, easyTokenContract, operatorContract;

    beforeEach('Deploy GeoToken and EasyToken', async () => {
        geoTokenContract = await GeoToken.new({
            from: owner,
        });

        operatorContract = await Operator.new({
            from: owner,
        });

        let operatorAddr = [operatorContract.address];
        easyTokenContract = await deployProxy(EasyToken, [operatorAddr], {
            from: owner,
        });

        await easyTokenContract.setToken(geoTokenContract.address, { from: owner });
        await operatorContract.setToken(easyTokenContract.address, { from: owner });

    });  

    describe('Token Wrap', () => {
        it('Gas consumption: operatorSend()' , async () => {
            await geoTokenContract.approve(easyTokenContract.address, 100, { from: owner });
            await easyTokenContract.deposit(100, { from: owner });
            await easyTokenContract.authorizeOperator(operator, { from: owner });
            let receipt = await easyTokenContract.operatorSend(owner, user, 100, [], [], { from: operator });
            console.log(`Gas cost withdraw(): ${receipt.receipt.gasUsed}`);
        })
        it('Gas consumption: operatorWithdraw()' , async () => {
            await geoTokenContract.approve(easyTokenContract.address, 100, { from: owner });
            await easyTokenContract.deposit(100, { from: owner });
            await operatorContract.addOperator(operator, { from: owner });
            let receipt = await operatorContract.operatorWithdraw(owner, 100, { from: operator });
            console.log(`Gas cost withdraw(): ${receipt.receipt.gasUsed}`);
        })
        it('Gas consumption: operatorSendEasyToken()' , async () => {
            await geoTokenContract.approve(easyTokenContract.address, 100, { from: owner });
            await easyTokenContract.deposit(100, { from: owner });
            await operatorContract.addOperator(operator, { from: owner });
            let receipt = await operatorContract.operatorSendEasyToken(owner, accounts[0], 100, { from: operator });
            console.log(`Gas cost withdraw(): ${receipt.receipt.gasUsed}`);
        })
    })
});