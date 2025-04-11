"use client";

import { Keypair, PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import { useVestingProgram, useVestingProgramAccount } from "./vesting-data-access";
import { useWallet } from "@solana/wallet-adapter-react";

export function VestingCreate() {
  const { createVestingAccount } = useVestingProgram();
  const [company, setcompany] = useState("");
  const { publicKey } = useWallet();
  const [mint, setmint] = useState("");
  const isFormValid = company.length > 0;

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      createVestingAccount.mutateAsync({ companyName: company, mint: mint });
    }
  };

  if (!publicKey) {
    return <p>connect to your wallet</p>;
  }

  return (
    <div>
      <input type="text" onChange={(e) => setcompany(e.target.value)} placeholder="company name" />
      <input type="text" onChange={(e) => setmint(e.target.value)} placeholder="token mint address" />
      <button onClick={handleSubmit} disabled={createVestingAccount.isPending}>
        create new vesting account {createVestingAccount.isPending || "....."}{" "}
      </button>
    </div>
  );
}

export function VestingList() {
  const { accounts, getProgramAccount } = useVestingProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    );
  }
  return (
    <div className={"space-y-6"}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <VestingCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={"text-2xl"}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function VestingCard({ account }: { account: PublicKey }) {
  const { accountQuery, createEmployeeVesting } = useVestingProgramAccount({ account });

  const [startTime, setstartTime] = useState(0);
  const [endTime, setendTime] = useState(0);
  const [cliffTime, setcliffTime] = useState(0);
  const [totalAmount, settotalAmount] = useState(0);
  const [beneficiary, setbeneficiary] = useState("");

  const companyName = useMemo(() => accountQuery.data?.companyName ?? 0, [accountQuery.data?.companyName]);

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2 className="card-title justify-center text-3xl cursor-pointer" onClick={() => accountQuery.refetch()}>
            {companyName}
          </h2>
          <div className="card-actions justify-around">
            <input
              type="text"
              placeholder="start time"
              value={startTime || ""}
              onChange={(e) => setstartTime(parseInt(e.target.value))}
            />
            <input
              type="text"
              placeholder="end time"
              value={endTime || ""}
              onChange={(e) => setendTime(parseInt(e.target.value))}
            />
            <input
              type="text"
              placeholder="cliff time"
              value={cliffTime || ""}
              onChange={(e) => setcliffTime(parseInt(e.target.value))}
            />
            <input
              type="text"
              placeholder="time allocation"
              value={totalAmount || ""}
              onChange={(e) => settotalAmount(parseInt(e.target.value))}
            />

            <input
              type="text"
              placeholder="beneficiary wallet address"
              value={beneficiary || ""}
              onChange={(e) => setbeneficiary(e.target.value)}
            />
            <button
              onClick={() => {
                createEmployeeVesting.mutateAsync({
                  startTime,
                  endTime,
                  totalAmount,
                  cliffTime,
                  beneficiary,
                });
              }}
              disabled={createEmployeeVesting.isPending}
            >
              create employee vesting account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
