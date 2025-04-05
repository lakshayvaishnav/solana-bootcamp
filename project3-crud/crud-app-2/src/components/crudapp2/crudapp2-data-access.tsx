"use client";

import { getCrudapp2Program, getCrudapp2ProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import { title } from "process";

interface CreateEntryArgs {
  title: string;
  message: string;
  owner: PublicKey;
}

export function useCrudapp2Program() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();

  const programId = useMemo(
    () => getCrudapp2ProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = useMemo(
    () => getCrudapp2Program(provider, programId),
    [provider, programId]
  );

  const accounts = useQuery({
    queryKey: ["crudapp2", "all", { cluster }],
    queryFn: () => program.account.journalEntryState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createEntry = useMutation({
    mutationKey: ["crudapp2", "createEntry", { cluster }],
    mutationFn: async ({
      title,
      message,
      owner,
    }: {
      title: string;
      message: string;
      owner: PublicKey;
    }) => {
      const [programAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from(title), owner.toBuffer()],
        programId
      );

      return program.methods.createJournalEntry(title, message).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create journal entry: ${error.message}`);
    },
  });


  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry
  };
}

export function useCrudapp2ProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts, programId } = useCrudapp2Program();

  const accountQuery = useQuery({
    queryKey: ["crudapp2", "fetch", { cluster, account }],
    queryFn: () => program.account.journalEntryState.fetch(account),
  });

  
  const updateEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ["crudapp2", "updateEntry", { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      const [programAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from(title), owner.toBuffer()],
        programId
      );

      return program.methods.updateJournalEntry(title, message).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update journal entry: ${error.message}`);
    },
  });

  const deleteEntry = useMutation({
    mutationKey: ["crudapp2", "deleteEntry", { cluster }],
    mutationFn: async ({ title }: { title: string }) => {
      return program.methods.deleteJournalEntry(title).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update journal entry: ${error.message}`);
    },
  });

  return {
    accountQuery,
    updateEntry,
    deleteEntry,
  };
}
