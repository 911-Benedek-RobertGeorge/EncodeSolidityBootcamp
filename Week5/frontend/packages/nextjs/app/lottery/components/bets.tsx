/* eslint-disable prettier/prettier */
import { useState } from "react";
import { hexToBigInt, parseEther, toHex, hexToString } from "viem";
import { usePublicClient, useWriteContract } from "wagmi";
import { abi } from "../../../abi/Lottery.json"



export function Bet({ address, blockExplorer, reRenderLotteryState }: { address: string, blockExplorer: string, reRenderLotteryState: () => void }) {
    const [amount, setAmount] = useState("");
    const { writeContractAsync } = useWriteContract();
    const [result, setResult] = useState<string | null>(null)
    const [error, setError] = useState<String | null>(null);
    const handleBets = async () => {
        if (address && amount) {
            if (amount == '1') {
                console.log(`Bet ${amount} time`);
                const tx = await writeContractAsync({
                    abi,
                    address: address,
                    functionName: 'bet',
                }).catch((e: Error) => setError(e.message))
                if (tx) {
                    setResult(tx)
                    setError(null)
                    reRenderLotteryState();
                }
                console.log(`tx hash: ${tx}`)
            } else {
                console.log(`Bet ${amount} times`);
                const tx = await writeContractAsync({
                    abi,
                    address: address,
                    functionName: 'betMany',
                    args: [BigInt(amount)],
                }).catch((e: Error) => setError(e.message))
                if (tx) {
                    setResult(tx)
                    setError(null)
                    reRenderLotteryState();
                }
                console.log(`tx hash: ${tx}`)
            }

        }
    }

    return (
        <div className="card w-full  bg-primary text-primary-content mt-4 p-4 ">
            <div className="card-body">
                <h2 className="card-title">Bet tokens</h2>
                <>
                    <label className="label">
                        <span className="label-text">Enter the amount of time to bet</span>
                    </label>
                    <input
                        type="number"
                        placeholder="Enter the amount of times to bet"
                        className="input input-bordered w-full max-w-xs"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </>
            </div>
            {error && (<>
                <span className="label-text">Error: {error} </span>
            </>)}
            {!result && <button
                className="btn btn-active btn-neutral"
                disabled={false}
                onClick={handleBets}
            >
                Bet !
            </button>}
            {result && <label className="label flex flex-col">
                <span className="label-text">Transaction Hash: {result} </span>
                <div className="flex">
                    <a target="_blank" href={blockExplorer + result} className="label-text hover:scale-125 bg-slate-500 rounded-3xl p-2"> Check it on explorer!  </a>
                    <button
                        className="btn btn-active btn-neutral"
                        disabled={false}
                        onClick={() => setResult(null)}
                    >Bet again</button>
                </div>
            </label>
            }
        </div>
    );
}