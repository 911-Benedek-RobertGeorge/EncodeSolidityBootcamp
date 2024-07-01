import { viem } from "hardhat";
import { Account } from "viem";
import { load_account_from_env } from "../utils/load_env";

const addressesToSendTokens = [
  "0x46Bec6C328eDA6A432A45b9c0c598A1A6e15C4d3", //Detergent
  "0xC6CbDd7D90458c5e1003DdE243bF1561efAeE516", //Nicolas Beaudouin -
  "0xe046945f31e7510588155138cc9a62838c635108", //@lakunle
  "0x8f731049CfE57d67E8c1507B78A41E6EC8cD0731", //@kvngeko.eth
  "0x9d1aAF184154E9d6Fc7d138Ee560134732427f7E", //Robert

  "0x23e2009fF32160D3357106EAbEe8e09868Ae7FC1", //@lakunle
  "0x472c1C8D4A26bBa989Bf3B82feFF3BddA39F8380", //@kvngeko.eth
];

export async function mintingTokens(
  contract: `0x${string}`,
  amount: bigint,
  account: Account
) {
  const tokenContract = await viem.getContractAt("MyToken", contract);
  for (const address of addressesToSendTokens) {
    console.log(`Minting ${amount} tokens to ${address}`);
    await tokenContract.write.mint([address as `0x${string}`, amount], {
      account,
    });
  }
}

async function main() {
  const publicClient = await viem.getPublicClient();

  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  const amountToMintForEachAddress = BigInt(parameters[1]);
  console.log(`Minting ${amountToMintForEachAddress} tokens to each address`);
  const [account] = load_account_from_env();
  console.log(`Account address: ${account.address} `);
  const balance = await publicClient.getBalance({
    address: account.address,
  });
  console.log("balance:", balance);
  mintingTokens(contractAddress, amountToMintForEachAddress, account);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
