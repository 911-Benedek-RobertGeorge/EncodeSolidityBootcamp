import {
    toHex,
    hexToString,
    createPublicClient,
    http,
    createWalletClient,
    formatEther,
  } from "viem";

  import { viem } from "hardhat";
  import { Account } from "viem";
  import { sepolia } from "viem/chains";
  import { load_account_from_env, load_api_sepolia } from "../utils/load_env";
  import {abi} from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";


const TOKENIZED_BALLOT_CONTRACT_ADDRESS = "0x72F186E758Dd0e9F983CA16a51307E750DBc4eD8";

  export async function castVote(
    contract: `0x${string}`,
    proposal: bigint, 
    amount: bigint,
    account: Account
  ) {
    const tokenizedBallotContract = await viem.getContractAt("TokenizedBallot", contract);
    console.log(`Voting ${amount} tokens to proposal ${proposal}`);

    const votePower = await tokenizedBallotContract.read.getVotePower([account.address]);

    const hash = await tokenizedBallotContract.write.vote([proposal,amount], { account });
    console.log("Transaction hash:", hash);
    return hash;
  }


  async function main() {
    const { url: apiUrl } = load_api_sepolia();
    const [account] = load_account_from_env();
  

    const parameters = process.argv.slice(2);
     if (!parameters || parameters.length < 3)
      throw new Error("Parameters not provided");

    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
      throw new Error("Invalid contract address");

    const proposalIndex = parameters[1];
    if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");

    const proposalAmountToVote = parameters[2];
    if (isNaN(Number(proposalAmountToVote))) throw new Error("Invalid proposal index");
    
    

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
 
    stdin.addListener("data", async function (d) {
      if (d.toString().trim().toLowerCase() != "n") {
        console.log("Voting...");
       await  castVote(contractAddress, BigInt(proposalIndex), BigInt(proposalAmountToVote), account);
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