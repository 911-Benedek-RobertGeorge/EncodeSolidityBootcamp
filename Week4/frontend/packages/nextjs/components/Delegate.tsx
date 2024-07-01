/* eslint-disable prettier/prettier */
import {   useState } from "react";
// import { hexToBigInt, parseEther, toHex, hexToString } from "viem";
import {   usePublicClient, useWriteContract } from "wagmi";
import { abi } from "../abi/MyToken.json"
import { CONST_SEPOLIA_TOKEN_ADDRESS } from "~~/utils/getChain";
import { useAccount } from 'wagmi';



export function Delegate() {
    // const [proposals, setProposals] = useState<string[]>([])
    const [tokenAddress, setTokenAdress] = useState(null) // token contract address 
     // const [indexProposal, setIndexProposal] = useState<number | null>(null);
    const { writeContractAsync } = useWriteContract();
    const [result, setResult] = useState<string | null>(null)
    const client = usePublicClient();
    const { address } = useAccount();
    console.log("client", address);
    console.log("Result", result)   ;
    const handleDelegate = async () => {
      
            try {
                const tx = await writeContractAsync({
                    abi,
                    address: CONST_SEPOLIA_TOKEN_ADDRESS as `0x${string}`,
                    functionName: 'delegate',
                    args:  [address as `0x${string}`],
                }).catch((e: Error) => { throw e })
                setResult(`${tx}`)
            } catch (error) {
                setResult(error.message)
            }
       
    }

    return (
        <div className="card w-full bg-primary text-primary-content mt-4 p-4 ">
            <div className="card-body">
                <>
                <h2 className="card-title">Delegate - {tokenAddress ?? CONST_SEPOLIA_TOKEN_ADDRESS}</h2>
                      <label className="label">
                        <span className="label-text">Enter token contract address (optional):</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Contract Address"
                        className="input input-bordered w-full  "
                        value={tokenAddress ?? CONST_SEPOLIA_TOKEN_ADDRESS}
                        onChange={e => setTokenAdress(e.target.value)}
                     />
                </> 
               
                 {
                  <button
                className="btn btn-active btn-neutral w-[50%]"
                // disabled={!!result}
                onClick={handleDelegate}
            >
                Delegate My Tokens!
            </button>
            }
            {result &&    <label className="label flex flex-col">
                   <span className="label-text">Transaction Hash: {result} </span>    
                            <a target="_blank" href={"https://sepolia.etherscan.io/tx/" + result} className="label-text hover:scale-125 bg-slate-500 rounded-3xl p-2"> Check it on explorer!  </a>
                        </label>}
            </div>
           
        </div>
    );
}