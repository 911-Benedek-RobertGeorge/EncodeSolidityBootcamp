import { task, type HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { load_account_from_env, load_api_sepolia } from "./utils/load_env";
import { HDAccountsUserConfig } from "hardhat/types";

// Loading either the hd account or the private key
const [acc, privateData] = load_account_from_env();
let accounts;
if (acc.source == "hd") {
  const hd: HDAccountsUserConfig = {
    mnemonic: privateData,
    path: "m/44'/60'/0'/0",
    initialIndex: 0,
    count: 20,
    passphrase: "",
  };
  accounts = hd;
} else {
  // if (acc.source == 'privateKey')
  accounts = [privateData];
}

// Hardhat config
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {},
    sepolia: {
      url: load_api_sepolia().url,
      accounts,
    },
  },
};

export default config;
