/* eslint-disable prettier/prettier */
import {   useState } from "react";
// import { hexToBigInt, parseEther, toHex, hexToString } from "viem";
import {   usePublicClient   } from "wagmi";
import { abi } from "../abi/TokenizedBallot.json"
import { CONST_SEPOLIA_BALLOT_ADDRESS    } from "~~/utils/getChain";
import { useAccount } from 'wagmi';
import { formatUnits, fromHex, hexToString } from "viem";
 


export function Query() {
    // const [proposals, setProposals] = useState<string[]>([])
      // const [indexProposal, setIndexProposal] = useState<number | null>(null);
     const [result, setResult] = useState<string | null>(null)
    const client = usePublicClient();
    const { address } = useAccount();
    console.log("client", address);
    console.log("Result", result);
 

    const handleGetResults = async () => {
        const winningIndex = await client?.readContract({
                                abi: abi,
                                address: CONST_SEPOLIA_BALLOT_ADDRESS as `0x${string}`,
                                functionName: 'winningProposal',
                                args: []
                            }
                            )
        console.log("Winning Index", winningIndex);
        const result: any= await client?.readContract({
            abi: abi,
            address: CONST_SEPOLIA_BALLOT_ADDRESS as `0x${string}`,
            functionName: 'proposals',
            args: [winningIndex]
        } 
        ) as any;

        const winnerName = await client?.readContract({
            abi: abi,
            address: CONST_SEPOLIA_BALLOT_ADDRESS as `0x${string}`,
            functionName: 'winnerName',
            args: []
        }
        )  
        console.log("Result", result);   
        console.log("Winner Name", fromHex(winnerName as `0x${string}`,"string"));
        if(result[0] && result[1])
         setResult(hexToString(result[0] as `0x${string}`, { size: 32 })  + "  --->  " +  formatUnits(result[1],18)   + " votes");
    }

    return (
        <div className="card w-full bg-primary text-primary-content mt-4 p-4 ">
            <div className="card-body">
               
                <h2 className="card-title">Query Results  </h2>
                     
               
               
                 {
                  <button
                className="btn btn-active btn-neutral w-[50%]"
                // disabled={!!result}
                onClick={handleGetResults}
            >
               Check who won the vote!
            </button>
            }
            {result &&    <label className="label flex flex-col">
                   <span className="label-text">Result: {result} </span>    
                         </label>}
            </div>
           
        </div>
    );
}