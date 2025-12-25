require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: process.env.RPC_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
  },
};
