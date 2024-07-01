/* eslint-disable prettier/prettier */
 import {   useState } from "react";
import { hexToBigInt, parseEther, toHex, hexToString } from "viem";
import {   usePublicClient, useWriteContract } from "wagmi";
import { abi } from "../abi/TokenizedBallot.json"
import { CONST_SEPOLIA_BALLOT_ADDRESS } from "~~/utils/getChain";



export function CastVote() {
    const [proposals, setProposals] = useState<string[]>([])
    const [address, setAdress] = useState(CONST_SEPOLIA_BALLOT_ADDRESS as `0x${string}`)
    const [amount, setAmount] = useState("");
    const [indexProposal, setIndexProposal] = useState<number | null>(null);
    const { writeContractAsync } = useWriteContract();
    const [result, setResult] = useState<string | null>(null)
    const client = usePublicClient();


    const handleGetProposals = async () => {
        client?.getStorageAt({ address: address, slot: toHex(1) })
            .then(
                async (size) => {
                    if (size) {
                        const lenght = hexToBigInt(size)
                        const _proposals = []
                        for (let i = BigInt(0); i < lenght; i++) {
                            const [proposal] = await client.readContract({
                                abi: abi,
                                address: address,
                                functionName: 'proposals',
                                args: [i]
                            }
                            ) as [`0x${string}`, bigint];
                            _proposals.push(hexToString(proposal, { size: 32 }));
                        }
                        setProposals(_proposals);
                    }
                }
            )
    }

    const handleProposalClick = (index: any) => {
        console.log('Clicked proposal index:', index);
        setIndexProposal(index)
        // You can perform any action needed with the index here
    };

    const handleCastVote = async () => {
         if (indexProposal != null  && amount) {
            try {
                console.log('Casting vote for proposal:', indexProposal, amount);   
                const tx = await writeContractAsync({
                    abi,
                    address: address,
                    functionName: 'vote',
                    args: [
                        BigInt(indexProposal),
                        parseEther(amount)
                    ],
                }).catch((e: Error) => { throw e })
                setResult(`tx hash: ${tx}`)
                console.log(`tx hash: ${tx}`)   
            } catch (error) {
                console.log("ERROR occured : " , error.message)
                setResult(error.message)
            }
        }
    }

    return (
        <div className="card w-full  bg-primary text-primary-content mt-4 p-4 ">
            <div className="card-body">
                <h2 className="card-title">Cast a vote</h2>
                {proposals && (<>
                    <label className="label">
                        <span className="label-text">Enter contract address:</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Contract Address"
                        className="input input-bordered w-full "
                        value={address}
                        onChange={e => setAdress(e.target.value)}
                     />
                    <button
                        className="btn w-[40%] items-center justify-center btn-active btn-neutral"
                        onClick={handleGetProposals}
                    >   
                        Get Proposals
                    </button>
                    
                </>)}
                {!result ? (
                    <>
                        <label className="label">
                            <span className="label-text">Enter the amount to vote for:</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter the amount to vote"
                            className="input input-bordered w-full max-w-xs"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                        <label className="label">
                            <span className="label-text">Click on the proposal:</span>
                        </label>
                        {(
                            <ul className="bg-secondary rounded-2xl p-8  ">
                                {proposals.map((proposal, index) => (
                                    <li className="bg-primary rounded-3xl p-2 my-2 text-center" key={index} onClick={() => handleProposalClick(index)}>
                                        {proposal}
                                        {indexProposal === index && "-- Selected!"}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>) : (
                    <>
                        <label className="label">
                            <span className="label-text">{result}</span>
                        </label>
                    </>
                )
                }
            </div>
            {!result && <button
                className="btn btn-active btn-neutral"
                disabled={false}
                onClick={handleCastVote}
            >
                Cast Vote !
            </button>}
        </div>
    );
}