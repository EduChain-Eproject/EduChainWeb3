import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    'testnet': {
      url: 'https://sepolia.base.org',
      accounts: [process.env.PRIVATE_KEY as string],
      gasPrice: 1000000000,
    },
    'mainnet': {
      url: 'https://mainnet.base.org',
      accounts: [process.env.PRIVATE_KEY as string],
      gasPrice: 1000000000,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};

export default config;
