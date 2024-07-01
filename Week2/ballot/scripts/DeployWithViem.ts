import {
  toHex,
  hexToString,
  createPublicClient,
  http,
  createWalletClient,
  formatEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { sepolia } from "viem/chains";
import { load_account_from_env, load_api_sepolia } from "../utils/load_env";

const { url: apiUrl } = load_api_sepolia();
const [deployerAccount] = load_account_from_env();

async function main() {
  const proposals = process.argv.slice(2);
  if (!proposals || proposals.length < 1)
    throw new Error("Proposals not provided");
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(apiUrl),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  const deployer = createWalletClient({
    account: deployerAccount,
    chain: sepolia,
    transport: http(apiUrl),
  });
  console.log("Deployer address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );
  console.log("\nDeploying Ballot contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [proposals.map((prop) => toHex(prop, { size: 32 }))],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Ballot contract deployed to:", receipt.contractAddress);

  if (!receipt.contractAddress) throw new Error("Contract address not found");
  console.log("Proposals: ");
  for (let index = 0; index < proposals.length; index++) {
    const proposal = (await publicClient.readContract({
      address: receipt.contractAddress,
      abi,
      functionName: "proposals",
      args: [BigInt(index)],
    })) as any[];
    const name = hexToString(proposal[0], { size: 32 });
    console.log({ index, name, proposal });
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
