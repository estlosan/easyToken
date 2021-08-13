/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

/**
 * Utils and imports
 */

const fs = require('fs-extra');
const path = require('path');
require('chai/register-should');
const { toWei } = require('web3-utils');
const HDWalletProvider = require('@truffle/hdwallet-provider');

/**
 * Secrets path. A path containing a JSON with structure:
 * {
 * mnemonic: <mnemonic>,
 * endpoints: {<networkName>: <networkEndpoint>, ...}
 * }
 */

const secretsPath = path.resolve(__dirname, '.secrets.json');
let secrets = undefined;
if (fs.pathExistsSync(secretsPath))
  secrets = fs.readJsonSync(secretsPath, { throws: false });

/**
 * Configuration for the most popular testnets and GeoDB's own testnet: stars
 */
const defaultNetworksConfig = {
  ropsten: {
    gas: 5500000,
    network_id: '3',
    gasPrice: toWei('2', 'gwei'),
  },
  rinkeby: {
    network_id: '4',
    gas: 6721975,
    gasPrice: toWei('26', 'gwei'),
  },
  kovan: {
    gas: 8000000,
    network_id: '42',
    gasPrice: toWei('2', 'gwei'),
  },
  stars: {
    gasPrice: '0',
    network_id: '19080880',
  },
};

/**
 * Parse the secrets file to accomodate for the networks object for
 * truffle-config. Inject the secrets into the
 * HDWalletProvider and if it is a well-known testnet,
 * include its configuration.
 */
let networks = {};

let mnemonic = '';

if (process.env.MNEMONIC) mnemonic = process.env.MNEMONIC;
else if (secrets && secrets.mnemonic) mnemonic = secrets.mnemonic;

if (mnemonic && secrets.endpoints) {
  mnemonic = mnemonic.trim();
  const definedNetworks = Object.keys(secrets.endpoints);

  for (let i = 0; i < definedNetworks.length; i++) {
    const networkName = definedNetworks[i];
    const defaultConfig = defaultNetworksConfig.hasOwnProperty(networkName)
      ? { ...defaultNetworksConfig[networkName] }
      : {};

    if (secrets.endpoints[`${networkName}`]) {
      networks[`${networkName}`] = {
        provider: new HDWalletProvider(
          mnemonic,
          secrets.endpoints[`${networkName}`],
          0,
          10
        ),
        confirmations: 2,
        ...defaultConfig,
      };
    }
  }
}

module.exports = {
  networks: {
    advanced: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 5500000,
    },
    ganache: {
      host: 'ganache',
      port: 8545,
      network_id: '*',
      gas: 14000000,
    },
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mumbai.matic.today`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/a94ef15eab694e62af85d2ca49f2ffc9`),
      network_id: '4',
      gas: 8000000,
      skipDryRun:true
    },
    goerli: {
      provider: () => new HDWalletProvider(mnemonic, `https://goerli.infura.io/v3/40aaa5d449714813a90b2439635adbb9`),
      network_id: '5',
      gas: 8000000,
      websockets:false,
      skipDryRun:true
    },
    ...networks,
  },
  // ens: {
  //   enabled: true
  // }
  // Set default mocha options here, use special reporters etc.
  // mocha: {
  //   // timeout: 100000
  //   reporter: 'mocha-truffle-reporter',
  // },
  plugins: ['truffle-plugin-verify'], plugins: ["solidity-coverage"],
  api_keys: {
    etherscan: (secrets && secrets.apis && secrets.apis.etherscan) || '',
  },
  // Configure your compilers
  mocha: {
    enableTimeouts: false,
    before_timeout: 120000 // Here is 2min but can be whatever timeout is suitable for you.
  },
  compilers: {
    solc: {
      version: '0.6.10', // Fetch exact version from solc-bin (default: truffle's version)
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
};
