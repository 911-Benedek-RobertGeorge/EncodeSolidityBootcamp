import * as chains from "viem/chains";
export type ChainKeys = keyof typeof chains;

export const CONST_SEPOLIA_TOKEN_ADDRESS = "0x785ad3b5b6a0592f6e5627e9895b392632541ff3";
export const CONST_SEPOLIA_BALLOT_ADDRESS = "0x72F186E758Dd0e9F983CA16a51307E750DBc4eD8"; /// new contract"0x23038b8beb34163530712918b123cf7d21442c94";

function isValidChainKey(key: string): key is ChainKeys {
    return key in chains;
}

export function getChainFromEnv(): chains.Chain {
const envChain : string | undefined = process.env.NEXT_PUBLIC_CHAIN_ENV;
if(envChain && isValidChainKey(envChain)){
    return chains[envChain];
} else {  
    return chains.sepolia;
}
}

 