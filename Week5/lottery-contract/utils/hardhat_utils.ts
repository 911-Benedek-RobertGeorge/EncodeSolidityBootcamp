import { viem } from "hardhat";


export async function getAccounts() {
    return await viem.getWalletClients();
}

export async function getClient() {
    return await viem.getPublicClient();
}

export async function initContracts(ratio: bigint, betPrice: bigint, betFee: bigint) {
    const contract = await viem.deployContract("Lottery", [
        "LotteryToken",
        "LT0",
        ratio,
        betPrice,
        betFee
    ]);
    const contractAddress = contract.address;
    const tokenAddress = await contract.read.paymentToken();
    return { contractAddress, tokenAddress }
}