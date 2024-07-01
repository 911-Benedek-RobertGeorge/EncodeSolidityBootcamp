import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem, run as hardhatRun } from "hardhat";
import { getAccounts, getClient, initContracts } from "../utils/hardhat_utils";
import { parseEther } from "viem"
import { MAXUINT256 } from "../utils/const";

const BET_PRICE = "1";
const BET_FEE = "0.2";
const TOKEN_RATIO = 1n;


async function deployContract() {
  const [deployer, acc1, acc2] = await getAccounts();
  const publicClient = await getClient();
  const { contractAddress, tokenAddress } = await initContracts(TOKEN_RATIO, parseEther(BET_PRICE),
    parseEther(BET_FEE));
  const lotteryContract = await viem.getContractAt("Lottery", contractAddress);
  const tokenContract = await viem.getContractAt("LotteryToken", tokenAddress);

  return {
    deployer,
    acc1,
    acc2,
    publicClient,
    lotteryContract,
    tokenContract
  }
}

before(async function () {
  await hardhatRun("compile");
});

describe("Lottery", function () {

  describe("Buy tokens", function () {
    it("should receive the expected amount", async function () {
      const valueToReceive = 2n
      const { lotteryContract, tokenContract, deployer } = await loadFixture(deployContract);
      await lotteryContract.write.purchaseTokens({ value: valueToReceive });
      const valueTokens = await tokenContract.read.balanceOf([deployer.account.address]);

      expect(valueTokens).to.equals(TOKEN_RATIO * valueToReceive);
    });


    it("the total supply of tokens should be related to the total amount bought", async function () {
      const valueToReceive = 2n
      const { lotteryContract, tokenContract, deployer, acc1 } = await loadFixture(deployContract);
      await lotteryContract.write.purchaseTokens({ value: valueToReceive });
      await lotteryContract.write.purchaseTokens({ value: valueToReceive, account: acc1.account });
      const totalSupply = await tokenContract.read.totalSupply()

      expect(totalSupply).to.equals(TOKEN_RATIO * valueToReceive * 2n);
    });

    it("should receive 0 for 0", async function () {
      const valueToReceive = 0n
      const { lotteryContract, tokenContract, deployer } = await loadFixture(deployContract);
      await lotteryContract.write.purchaseTokens({ value: valueToReceive });
      const valueTokens = await tokenContract.read.balanceOf([deployer.account.address]);

      expect(valueTokens).to.equals(0n);
    });

  });
  describe("Returns tokens", function () {
    it("should get back to state minus gas fees", async function () {
      const valueToReceive = 2n
      const { lotteryContract, tokenContract, deployer, publicClient } = await loadFixture(deployContract);
      const initialValue = await publicClient.getBalance({ address: deployer.account.address });
      const purchaseTx = await lotteryContract.write.purchaseTokens({ value: valueToReceive });
      const purchaseReceipt = await publicClient.getTransactionReceipt({ hash: purchaseTx });

      const allowTx = await tokenContract.write.approve([lotteryContract.address, MAXUINT256], {
        account: deployer.account,
      });
      const allowReceipt = await publicClient.getTransactionReceipt({
        hash: allowTx,
      });
      const returnTx = await lotteryContract.write.returnTokens([valueToReceive * TOKEN_RATIO]);
      const returnReceipt = await publicClient.getTransactionReceipt({ hash: returnTx });

      const gasPurchase = purchaseReceipt.cumulativeGasUsed * purchaseReceipt.effectiveGasPrice
        + returnReceipt.cumulativeGasUsed * returnReceipt.effectiveGasPrice
        + allowReceipt.cumulativeGasUsed * allowReceipt.effectiveGasPrice;

      const valueAccount = await publicClient.getBalance({ address: deployer.account.address });


      expect(initialValue).to.equals(valueAccount + gasPurchase);
    });

  });
});
