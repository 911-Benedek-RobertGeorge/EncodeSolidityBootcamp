import {
  createPublicClient,
  http,
  createWalletClient,
  formatEther,
} from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { load_account_from_env, load_api_sepolia } from "../utils/load_env";

const { url: apiUrl } = load_api_sepolia();
const [account] = load_account_from_env();
  console.log("Account:", account.address);
async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;

  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  const delegateAddress = parameters[1] as `0x${string}`;
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(apiUrl),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(apiUrl),
  });

  console.log("Deployer address:", walletClient.account.address);
  const balance = await publicClient.getBalance({
    address: walletClient.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    walletClient.chain.nativeCurrency.symbol
  );

  const hash = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "delegate",
    account: account,
    args: [delegateAddress],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const reciept = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction Confirmed" , reciept);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
