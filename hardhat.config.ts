import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const INFURA_API_KEY = process.env.INFURA_API_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    'testnet': {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
      gasPrice: 1000000000,
    },
    'mainnet': {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
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
