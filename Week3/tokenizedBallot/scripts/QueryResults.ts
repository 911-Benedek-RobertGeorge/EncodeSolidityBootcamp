import { viem } from "hardhat";
import { hexToString, formatUnits } from "viem";

export async function queryResults(
  ballotContract: `0x${string}`,
) : Promise<[string,bigint,bigint]>{
  const tokenizedBallotContract = await viem.getContractAt("TokenizedBallot", ballotContract);
  const winningProposalIndex = await tokenizedBallotContract.read.winningProposal();
  const proposal = await tokenizedBallotContract.read.proposals([winningProposalIndex]);
  const name = hexToString(proposal[0], { size: 32 });
  const count = proposal[1];

  return [name,winningProposalIndex,count];
}
/* ARGUMENTS: 
    - Contract Address of the TokenizedBallot contract, 
*/
async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

  const [name,winningProposalIndex,count] = await queryResults(contractAddress);
  console.log(
    `Winning Proposal Name: ${name}, Winning Proposal Index: ${winningProposalIndex}, Vote Count: ${formatUnits(count,18)}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
