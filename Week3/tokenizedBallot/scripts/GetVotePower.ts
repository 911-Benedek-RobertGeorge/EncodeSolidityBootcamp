import { viem } from "hardhat";

export async function getVotePower(
  ballotContract: `0x${string}`,
  addressTo: `0x${string}`,
) {
  const tokenizedBallotContract = await viem.getContractAt("TokenizedBallot", ballotContract);
  const votePower = await tokenizedBallotContract.read.getVotePower([addressTo]);
  return votePower;
}
/* ARGUMENTS: 
    - Contract Address of the TokenizedBallot contract, 
    - Address of the account you want to check vote power  */
async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  const address = parameters[1] as `0x${string}`;
  const votePower = await getVotePower(contractAddress, address);
  console.log("Vote Power: ", votePower);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
