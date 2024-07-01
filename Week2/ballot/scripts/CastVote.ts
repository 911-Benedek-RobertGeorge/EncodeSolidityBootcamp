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
const [account] = load_account_from_env();

async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  const proposalIndex = parameters[1];
  if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");
  console.log("Proposal selected: ");
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(apiUrl),
  });
  const proposal = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "proposals",
    args: [BigInt(proposalIndex)],
  })) as any[];
  const name = hexToString(proposal[0], { size: 32 });
  console.log("Voting to proposal", name);
  console.log("Confirm? (Y/n)");
  const stdin = process.stdin.resume();
  const voter = createWalletClient({
    account: account,
    chain: sepolia,
    transport: http(apiUrl),
  });
  stdin.addListener("data", async function (d) {
    if (d.toString().trim().toLowerCase() != "n") {
      const hash = await voter.writeContract({
        address: contractAddress,
        abi,
        functionName: "vote",
        args: [BigInt(proposalIndex)],
      });
      console.log("Transaction hash:", hash);
      console.log("Waiting for confirmations...");
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Transaction confirmed");
    } else {
      console.log("Operation cancelled");
    }
    process.exit();
  });
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
