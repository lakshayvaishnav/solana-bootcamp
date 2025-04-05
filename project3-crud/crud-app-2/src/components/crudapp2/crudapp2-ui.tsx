"use client";

import { Keypair, PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import {
  useCrudapp2Program,
  useCrudapp2ProgramAccount,
} from "./crudapp2-data-access";
import { useWallet } from "@solana/wallet-adapter-react";

export function Crudapp2Create() {
  const [message, setmessage] = useState("");
  const [title, settitle] = useState("");
  const { createEntry, accounts } = useCrudapp2Program();
  const { publicKey } = useWallet();

  const isFormValid = message.trim() !== "";

  const handleSubmit = async () => {
    if (publicKey && isFormValid && title) {
      createEntry.mutateAsync({ title, message, owner: publicKey });
    }
  };

  if (!publicKey) {
    return <p>connect your wallet !!</p>;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => settitle(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setmessage(e.target.value)}
        className="textarea textarea-bordered w-full max-w-xs"
      />
      <br></br>
      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={handleSubmit}
        disabled={createEntry.isPending || !isFormValid}
      >
        Create Journal Entry {createEntry.isPending && "..."}
      </button>
      <h1 className="items-center bg-purple-400 w-full text-black">List</h1>
      <div>
        {accounts.data?.map((account) => (
          <div>{account.account.title}</div>
        ))}
      </div>
    </div>
  );
}

export function Crudapp2List() {
  const { accounts, getProgramAccount } = useCrudapp2Program();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className="flex  justify-between">
      {accounts.data?.map((account) => (
        <JournalCard account={account.publicKey} />
      ))}
    </div>
  );
}

export function JournalCard({ account }: { account: PublicKey }) {
  const { accountQuery, deleteEntry, updateEntry } = useCrudapp2ProgramAccount({
    account,
  });

  const handleDelete = async (title: string) => {
    alert("button clicked");
    await deleteEntry.mutateAsync({ title });
  };

  return (
    <div className="bg-black/10   flex justify-between w-full">
      <div className="flex flex-col gap-2 ">
        <h1> Title : {accountQuery.data?.title} </h1>
        <p>{accountQuery.data?.message}</p>
      </div>
      {accountQuery.data?.title && (
        <div className="flex flex-col gap-3">
          <button className="btn btn-accent">Update entry</button>
          <button
            className="btn btn-error"
            onClick={() => {
              if (accountQuery.data?.title) {
                alert("button clicked");
                deleteEntry.mutateAsync({ title: accountQuery.data.title });
              }
            }}
          >
            Delete entry
          </button>
        </div>
      )}
    </div>
  );
}
