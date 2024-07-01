import { expect } from "chai";
import { toHex, hexToString } from "viem";
import { viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function deployContract() {
  const publicClient = await viem.getPublicClient();
  const [
    deployer,
    otherAccount,
    otherSecondAccount,
    thirdAccount,
    forthAccount,
    fifthAccount,
  ] = await viem.getWalletClients();
  const ballotContract = await viem.deployContract("Ballot", [
    PROPOSALS.map((prop) => toHex(prop, { size: 32 })),
  ]);
  return {
    publicClient,
    deployer,
    otherAccount,
    otherSecondAccount,
    thirdAccount,
    forthAccount,
    fifthAccount,
    ballotContract,
  };
}

describe("Ballot", async () => {
  describe("when the contract is deployed", async () => {
    it("has the provided proposals", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.read.proposals([BigInt(index)]);
        expect(hexToString(proposal[0], { size: 32 })).to.eq(PROPOSALS[index]);
      }
    });

    it("has zero votes for all proposals", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.read.proposals([BigInt(index)]);
        expect(proposal[1]).to.eq(0n);
      }
    });

    it("sets the deployer address as chairperson", async () => {
      const { ballotContract, deployer } = await loadFixture(deployContract);
      const chairperson = await ballotContract.read.chairperson();
      expect(chairperson.toLowerCase()).to.eq(deployer.account.address);
    });

    it("sets the voting weight for the chairperson as 1", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      const chairperson = await ballotContract.read.chairperson();
      const chairpersonVoter = await ballotContract.read.voters([chairperson]);
      expect(chairpersonVoter[0]).to.eq(1n);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
    it("gives right to vote for another address", async () => {
      const { ballotContract, otherAccount } = await loadFixture(
        deployContract
      );
      const voterBefore = await ballotContract.read.voters([
        otherAccount.account.address,
      ]);

      expect(voterBefore[0]).to.equals(0n);
      await ballotContract.write.giveRightToVote([
        otherAccount.account.address,
      ]);
      const voter = await ballotContract.read.voters([
        otherAccount.account.address,
      ]);
      expect(voter[0]).to.equals(1n);
    });
    it("can not give right to vote for someone that has voted", async () => {
      const { ballotContract, otherAccount } = await loadFixture(
        deployContract
      );

      await ballotContract.write.giveRightToVote([
        otherAccount.account.address,
      ]);

      await ballotContract.write.vote([0n], {
        account: otherAccount.account.address,
      });

      await expect(
        ballotContract.write.giveRightToVote([otherAccount.account.address])
      ).to.be.rejectedWith("The voter already voted.");
    });
    it("can not give right to vote for someone that has already voting rights", async () => {
      const { ballotContract, otherAccount } = await loadFixture(
        deployContract
      );

      await ballotContract.write.giveRightToVote([
        otherAccount.account.address,
      ]);

      await expect(
        ballotContract.write.giveRightToVote([otherAccount.account.address])
      ).to.be.rejected;
    });
  });

  describe("when the voter interacts with the vote function in the contract", async () => {
    it("should register the vote", async () => {
      const { ballotContract, deployer } = await loadFixture(deployContract);

      await ballotContract.write.vote([0n], {
        account: deployer.account.address,
      });

      const vote = await ballotContract.read.voters([deployer.account.address]);

      expect(vote[1]).to.equals(true);

      const proposal0 = await ballotContract.read.proposals([0n]);

      expect(proposal0[1]).to.equals(1n);
    });
  });

  describe("when the voter interacts with the delegate function in the contract", async () => {
    it("should transfer voting power", async () => {
      const { ballotContract, deployer, otherAccount } = await loadFixture(
        deployContract
      );

      await ballotContract.write.giveRightToVote([
        otherAccount.account.address,
      ]);

      await ballotContract.write.delegate([otherAccount.account.address]);

      const voter_delegated = await ballotContract.read.voters([
        otherAccount.account.address,
      ]);
      const voter = await ballotContract.read.voters([
        deployer.account.address,
      ]);

      expect(voter[2].toLowerCase()).to.equals(otherAccount.account.address);
      expect(voter_delegated[0]).to.equals(2n);
    });
  });

  describe("when an account other than the chairperson interacts with the giveRightToVote function in the contract", async () => {
    it("should revert", async () => {
      const { ballotContract, otherAccount, otherSecondAccount } =
        await loadFixture(deployContract);

      await expect(
        ballotContract.write.giveRightToVote(
          [otherSecondAccount.account.address],
          { account: otherAccount.account }
        )
      ).to.be.rejectedWith("Only chairperson can give right to vote.");
    });
  });

  describe("when an account without right to vote interacts with the vote function in the contract", async () => {
    it("should revert", async () => {
      const { ballotContract, otherAccount, otherSecondAccount } =
        await loadFixture(deployContract);
      await expect(
        ballotContract.write.vote([1n], { account: otherAccount.account })
      ).to.be.rejectedWith("Has no right to vote");
    });
  });

  describe("when an account without right to vote interacts with the delegate function in the contract", async () => {
    it("should revert", async () => {
      const { ballotContract, otherAccount, deployer } = await loadFixture(
        deployContract
      );
      await expect(
        ballotContract.write.delegate([deployer.account.address], {
          account: otherAccount.account,
        })
      ).to.be.rejectedWith("You have no right to vote");
    });
  });

  describe("when someone interacts with the winningProposal function before any votes are cast", async () => {
    it("should return 0", async () => {
      const { ballotContract, otherAccount, deployer } = await loadFixture(
        deployContract
      );

      let result = await ballotContract.read.winningProposal();
      expect(result).to.equals(0n);
    });
  });

  describe("when someone interacts with the winningProposal function after one vote is cast for the first proposal", async () => {
    it("should return 0", async () => {
      const { ballotContract, deployer, otherAccount } = await loadFixture(
        deployContract
      );

      await ballotContract.write.vote([0n]);

      let result = await ballotContract.read.winningProposal();
      expect(result).to.equals(0n);
    });
  });

  describe("when someone interacts with the winnerName function before any votes are cast", async () => {
    it("should return name of proposal 0", async () => {
      const { ballotContract, otherAccount, deployer } = await loadFixture(
        deployContract
      );

      let proposal0 = await ballotContract.read.proposals([0n]);

      let result = await ballotContract.read.winnerName();
      expect(result).to.equals(proposal0[0]);
    });
  });

  describe("when someone interacts with the winnerName function after one vote is cast for the first proposal", async () => {
    it("should return name of proposal 0", async () => {
      const { ballotContract, deployer, otherAccount } = await loadFixture(
        deployContract
      );

      await ballotContract.write.vote([0n]);
      let proposal0 = await ballotContract.read.proposals([0n]);

      let result = await ballotContract.read.winnerName();
      expect(result).to.equals(proposal0[0]);
    });
  });

  describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
    it("should return the name of the winner proposal", async () => {
      const {
        ballotContract,
        deployer,
        otherAccount,
        otherSecondAccount,
        thirdAccount,
        forthAccount,
        fifthAccount,
      } = await loadFixture(deployContract);

      const accounts = [
        otherAccount,
        otherSecondAccount,
        thirdAccount,
        forthAccount,
        fifthAccount,
      ];
      for (const account of accounts) {
        await ballotContract.write.giveRightToVote([account.account.address]);
      }

      // First 2 accounts vote for 1n
      for (const account of accounts.slice(0, 2)) {
        await ballotContract.write.vote([1n], { account: account.account });
      }

      // Then 3 next accounts vote for 2n
      for (const account of accounts.slice(2, 5)) {
        await ballotContract.write.vote([2n], { account: account.account });
      }

      let result = await ballotContract.read.winningProposal();
      expect(result).to.equals(2n);
    });

    it("In case of equality, it return the first winning proposal", async () => {
      const {
        ballotContract,
        deployer,
        otherAccount,
        otherSecondAccount,
        thirdAccount,
        forthAccount,
        fifthAccount,
      } = await loadFixture(deployContract);

      const accounts = [
        otherAccount,
        otherSecondAccount,
        thirdAccount,
        forthAccount,
        fifthAccount,
      ];
      for (const account of accounts) {
        await ballotContract.write.giveRightToVote([account.account.address]);
      }

      // First 2 accounts vote for 1n
      for (const account of accounts.slice(0, 2)) {
        await ballotContract.write.vote([1n], { account: account.account });
      }

      // Then 2 next accounts vote for 2n
      for (const account of accounts.slice(2, 4)) {
        await ballotContract.write.vote([2n], { account: account.account });
      }

      // Last for 0n
      ballotContract.write.vote([1n], { account: accounts[4].account });

      let result = await ballotContract.read.winningProposal();
      expect(result).to.equals(1n);
    });
  });
});
