import { expect } from "chai";
import { toHex, hexToString } from "viem";
import { viem, run as hardhatRun } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { parseEther } from "viem";
import { delegateTokens } from "../scripts/DelegateTokens";

import {
  GetContractReturnType,
  PublicClient,
  WalletClient,
} from "@nomicfoundation/hardhat-viem/types";
import { ArtifactsMap } from "hardhat/types/artifacts";
import { castVote } from "../scripts/CastVote";
import { queryResults } from "../scripts/QueryResults";

type TokenizedBallot = GetContractReturnType<
  ArtifactsMap["TokenizedBallot"]["abi"]
>;

type MyToken = GetContractReturnType<ArtifactsMap["MyToken"]["abi"]>;

before(async function () {
  await hardhatRun("compile");
});

const PROPOSALS = ["Chocolate Mint", "Matheus", "Encode Club Sandwich"];
const MINT_VALUE = parseEther("10");

async function mint(
  account: `0x${string}`,
  value: bigint,
  tokenContract: MyToken,
  publicClient: PublicClient
) {
  const mintTx = await tokenContract.write.mint([account, value]);
  await publicClient.waitForTransactionReceipt({ hash: mintTx });
}
async function deployContract() {
  const publicClient = await viem.getPublicClient();
  const [deployer, acc1, acc2, acc3, acc4, acc5] =
    await viem.getWalletClients();
  const tokenContract = await viem.deployContract("MyToken");
  for (const acc of [acc1, acc2, acc3, acc4, acc5]) {
    mint(acc.account.address, MINT_VALUE, tokenContract, publicClient);
  }
  return {
    publicClient,
    tokenContract,
    deployer,
    acc1,
    acc2,
    acc3,
    acc4,
    acc5,
  };
}

async function deployBallotContract(
  blockNumber: bigint,
  tokenContractAddress: `0x${string}`
): Promise<TokenizedBallot> {
  const tokenizedBallotContract = (await viem.deployContract(
    "TokenizedBallot",
    [
      PROPOSALS.map((prop) => toHex(prop, { size: 32 })),
      tokenContractAddress,
      blockNumber,
    ]
  )) as any as TokenizedBallot;

  return tokenizedBallotContract;
}

describe("TokenizedBallot", async () => {
  describe("when the contract is deployed", async () => {
    it("has the provided proposals", async () => {
      const { tokenContract } = await loadFixture(deployContract);
      const tokenizedBallotContract = await deployBallotContract(
        0n,
        tokenContract.address
      );
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await tokenizedBallotContract.read.proposals([
          BigInt(index),
        ]);
        expect(hexToString(proposal[0], { size: 32 })).to.eq(PROPOSALS[index]);
      }
    });
    it("has the minted tokens", async () => {
      const { tokenContract, acc1, acc2 } = await loadFixture(deployContract);
      const balance1 = await tokenContract.read.balanceOf([
        acc1.account.address,
      ]);
      const balance2 = await tokenContract.read.balanceOf([
        acc2.account.address,
      ]);
      expect(balance1).to.equals(MINT_VALUE);
      expect(balance2).to.equals(MINT_VALUE);
    });
  });
  describe("Delegate tokens", async () => {
    it("before, we don't have vote power", async () => {
      const { tokenContract, acc1 } = await loadFixture(deployContract);
      const vote = await tokenContract.read.getVotes([acc1.account.address]);
      expect(vote).to.equals(0n);
    });
    it("after, we have vote power corresponding on the number of tokens", async () => {
      const { tokenContract, acc1 } = await loadFixture(deployContract);

      await delegateTokens(
        tokenContract.address,
        acc1.account.address,
        acc1.account
      );

      const vote = await tokenContract.read.getVotes([acc1.account.address]);
      expect(vote).to.equals(MINT_VALUE);
    });
    it("we can delegate to another account", async () => {
      const { tokenContract, acc1, acc2 } = await loadFixture(deployContract);

      await delegateTokens(
        tokenContract.address,
        acc2.account.address,
        acc1.account
      );

      const vote1 = await tokenContract.read.getVotes([acc1.account.address]);
      const vote2 = await tokenContract.read.getVotes([acc2.account.address]);
      expect(vote1).to.equals(0n);
      expect(vote2).to.equals(MINT_VALUE);
    });

    it("if we transfer after delegation we loose vote power", async () => {
      const { tokenContract, acc1, acc2 } = await loadFixture(deployContract);

      await delegateTokens(
        tokenContract.address,
        acc1.account.address,
        acc1.account
      );

      const two = parseEther("2");

      await tokenContract.write.transfer(
        [acc2.account.address, MINT_VALUE - two],
        {
          account: acc1.account,
        }
      );

      const vote1 = await tokenContract.read.getVotes([acc1.account.address]);
      const vote2 = await tokenContract.read.getVotes([acc2.account.address]);
      expect(vote1).to.equals(two);
      expect(vote2).to.equals(0n);
    });
  });
  describe("GetVotePower", async () => {
    it("votePower should be equals to the delegated tokens for blocks after delegate", async () => {
      const { tokenContract, acc1, publicClient } = await loadFixture(deployContract);
      await delegateTokens(
        tokenContract.address,
        acc1.account.address,
        acc1.account
      );
      const blockNumber = await publicClient.getBlockNumber();
      const tokenizedBallotContract = await deployBallotContract(blockNumber, tokenContract.address);
      const vote = await tokenizedBallotContract.read.getVotePower([acc1.account.address]);
      expect(vote).to.equals(MINT_VALUE);
    });
    it("votePower should be equals to the delegated tokens for another delegate", async () => {
      const { tokenContract, acc1, acc2, publicClient } = await loadFixture(deployContract);
      await delegateTokens(
        tokenContract.address,
        acc2.account.address,
        acc1.account
      );
      const blockNumber = await publicClient.getBlockNumber();
      const tokenizedBallotContract = await deployBallotContract(blockNumber, tokenContract.address);
      const vote1 = await tokenizedBallotContract.read.getVotePower([acc1.account.address]);
      const vote2 = await tokenizedBallotContract.read.getVotePower([acc2.account.address]);
      expect(vote1).to.equals(0n);
      expect(vote2).to.equals(MINT_VALUE);
    });
    
  });
  describe("Cast Vote", async () => {
    it("can cast a vote", async () => {
      const { tokenContract, acc1, publicClient } = await loadFixture(deployContract);
      await delegateTokens(
        tokenContract.address,
        acc1.account.address,
        acc1.account
      );
      const blockNumber = await publicClient.getBlockNumber();
      const tokenizedBallotContract = await deployBallotContract(blockNumber, tokenContract.address);
      await castVote(tokenizedBallotContract.address,2n,MINT_VALUE,acc1.account);
      const vote = await tokenizedBallotContract.read.getVotePower([acc1.account.address]);
      const proposal = await tokenizedBallotContract.read.proposals([2n]);
      expect(vote).to.equals(0n);
      expect(proposal[1]).to.equals(MINT_VALUE);
    });
    it("cannot cast a vote higher than vote power", async () => {
      const { tokenContract, acc1, publicClient } = await loadFixture(deployContract);
      await delegateTokens(
        tokenContract.address,
        acc1.account.address,
        acc1.account
      );
      const blockNumber = await publicClient.getBlockNumber();
      const tokenizedBallotContract = await deployBallotContract(blockNumber, tokenContract.address);
      const aboveValue = MINT_VALUE+1n;
      await expect(castVote(tokenizedBallotContract.address,2n,aboveValue,acc1.account)).to.rejectedWith("The amount to vote is too high");
    });
    
  });
  describe("Query Result", async () => {
    it("is a simple vote", async () => {
      const { tokenContract, acc1, publicClient } = await loadFixture(deployContract);
      await delegateTokens(
        tokenContract.address,
        acc1.account.address,
        acc1.account
      );
      const blockNumber = await publicClient.getBlockNumber();
      const tokenizedBallotContract = await deployBallotContract(blockNumber, tokenContract.address);
      await castVote(tokenizedBallotContract.address,2n,MINT_VALUE,acc1.account);
      const [_name,winningProposalIndex,count] = await queryResults(tokenizedBallotContract.address);
      expect(winningProposalIndex).to.equals(2n);
      expect(count).to.equals(MINT_VALUE);
    });
    it("has several votes", async () => {
      const { tokenContract, acc1, acc2, acc3, publicClient } = await loadFixture(deployContract);
      await delegateTokens(
        tokenContract.address,
        acc1.account.address,
        acc1.account
      );
      await delegateTokens(
        tokenContract.address,
        acc2.account.address,
        acc2.account
      );
      await delegateTokens(
        tokenContract.address,
        acc3.account.address,
        acc3.account
      );
      const blockNumber = await publicClient.getBlockNumber();
      const tokenizedBallotContract = await deployBallotContract(blockNumber, tokenContract.address);

      const valueDivided = MINT_VALUE / 2n;
      await castVote(tokenizedBallotContract.address,2n,valueDivided,acc1.account);
      await castVote(tokenizedBallotContract.address,1n,MINT_VALUE,acc2.account);
      await castVote(tokenizedBallotContract.address,1n,valueDivided,acc3.account);
      const [_name,winningProposalIndex,count] = await queryResults(tokenizedBallotContract.address);
      expect(winningProposalIndex).to.equals(1n);
      expect(count).to.equals(MINT_VALUE + valueDivided);
    });
    
  });
});
