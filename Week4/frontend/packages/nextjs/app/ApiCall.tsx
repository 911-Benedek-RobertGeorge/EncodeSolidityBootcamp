"use client";

import { useEffect, useState } from "react";
import { truncate } from "fs";
import type { NextPage } from "next";
import { useAccount, useBalance, useSignMessage } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const ApiCall: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <PageBody />
        </div>
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <WalletInfo />
    </>
  );
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected, chain } = useAccount();
  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <p>Connected to the network {chain?.name}</p>
        <WalletBalance address={address as `0x${string}`} />
        {/* <TokenInfo address={address as `0x${string}`} /> */}
        <ApiData address={address as `0x${string}`} />
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });
  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div className="card w-120 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Connected Wallet Balance & Token Balance</h2>
        Wallet Balance: {data?.formatted} {data?.symbol}
        <GetTokenBalance />
      </div>
    </div>
  );
}

function ApiData(params: { address: `0x${string}` }) {
  return (
    <div className="card w-120 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Mint Token From Api</h2>
        <TokenAddressFromApi />
        <TokenFromApi />
      </div>
    </div>
  );
}

function TokenAddressFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contract-address`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>No token address information</p>;

  return (
    <div>
      <p>Token address: {data.result}</p>
    </div>
  );
}

function TokenFromApi() {
  const [addressIput, setAddressInput] = useState("");
  const [amount, setAmount] = useState("");
  const [hash, setHash] = useState("");

  async function handleMintTokens() {
    const mintToken = await mintTokens(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mint-tokens`, {
      address: addressIput,
      amount: amount,
    });
    if (mintToken) setHash(mintToken.result);
  }

  return (
    <div>
      <div className="p-5">
        <input
          value={addressIput}
          placeholder="Mint Address"
          className="input"
          onChange={e => setAddressInput(e.target.value)}
        />
        <input
          value={amount}
          placeholder="Mint Amount"
          className="input"
          type="number"
          onChange={e => setAmount(e.target.value)}
        />

        <button className="btn btn-active btn-neutral" onClick={handleMintTokens}>
          Mint Token
        </button>
        {hash && (
          <p>
            <a className="btn btn-active btn-neutral" target="_blank" href={`https://sepolia.etherscan.io/tx/${hash}`}>
              Transaction Details
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

function GetTokenBalance() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/token-balance/${address}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token balance from API...</p>;
  if (!data) return <p>No token balance information</p>;
  return (
    <div>
      <p>Your Token Balance: {data.result}</p>
    </div>
  );
}

async function mintTokens(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export default ApiCall;
