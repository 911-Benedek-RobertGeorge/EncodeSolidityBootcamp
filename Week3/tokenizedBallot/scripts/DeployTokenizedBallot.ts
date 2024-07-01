import {
  createPublicClient,
  http,
  createWalletClient,
  formatEther,
  toHex,
  hexToString,
} from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import {
  abi,
  bytecode,
} from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { load_account_from_env } from "../utils/load_env";
require("dotenv").config();

const providerApiWithKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.SEPOLIA_PRIVATE_KEY || "";

const tokenContractAddress = "0x785ad3b5b6a0592f6e5627e9895b392632541ff3";

const lastblockNumber = 6126477;

async function main() {
  const parameters = process.argv.slice(2);
  const proposals = ["Chocolate Mint", "Matheus", "Encode Club Sandwich"];
  if (!proposals || proposals.length < 3)
    throw new Error("Proposals not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

  const targetBlockNumber = BigInt(parameters[1]);
  
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`${providerApiWithKey}`),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log(" block number:", blockNumber);

  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`${providerApiWithKey}`),
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
  console.log("\nDeploying Token Contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [
      proposals.map((prop) => toHex(prop, { size: 32 })),
      contractAddress,
      targetBlockNumber,
    ],
  });

  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("token contract deployed to:", receipt.contractAddress);

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
