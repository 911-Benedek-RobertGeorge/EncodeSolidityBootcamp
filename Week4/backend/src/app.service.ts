import { Injectable } from '@nestjs/common';
import {
  Address,
  createPublicClient,
  createWalletClient,
  formatUnits,
  http,
  parseEther,
} from 'viem';
import { sepolia } from 'viem/chains';
import * as tokenJson from './assets/MyToken.json';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class AppService {
  publicClient;
  walletClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });
    this.walletClient = createWalletClient({
      account: privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`),
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });
  }
  getHello(): string {
    return 'Hello World!';
  }

  test() {
    return 'It works!';
  }
  getContractAddress(): Address {
    return process.env.TOKEN_ADDRESS as Address;
  }

  getServerWalletAddress() {
    return this.walletClient.account.address;
  }

  async getSymbol() {
    const symbol = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'symbol',
    });
    return symbol;
  }

  async getDecimals() {
    const decimals = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'decimals',
    });
    return decimals;
  }

  async getTokenBalance(address: string) {
    const balance = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'balanceOf',
      args: [address],
    });
    const balanceString = `${formatUnits(balance, await this.getDecimals())} ${await this.getSymbol()}`;
    return balanceString;
  }

  async checkMinterRole(address: string) {
    const minterRole = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'MINTER_ROLE',
    });

    const hasRole = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'hasRole',
      args: [minterRole, address],
    });

    return hasRole
      ? `Address ${address} has Minter Role`
      : `Address ${address} does not have Minter Role`;
  }

  async mintTokens(address: any, amount: any) {
    console.log(address, amount);
    const amountParsed = parseEther(amount.toString());

    const mintTx = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'mint',
      args: [address, amountParsed],
    });
    // const hash = await this.publicClient.waitForTransactionReceipt({
    //   hash: mintTx,
    // });
    return mintTx;
  }

  async getRecentVotes(){
    // Data is stored in a file
    const fs = require('fs'); 
    const fileExists = fs.existsSync("data/lastVotes.json");
    console.log(fileExists);
    
    if(!fileExists){
      return [];
    }else {
    return JSON.parse(fs.readFileSync("data/lastVotes.json"))
    }
  }
}