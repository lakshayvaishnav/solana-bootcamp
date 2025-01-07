'use client'

import { getBlinksLearningProgram, getBlinksLearningProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useBlinksLearningProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getBlinksLearningProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getBlinksLearningProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['BlinksLearning', 'all', { cluster }],
    queryFn: () => program.account.BlinksLearning.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['BlinksLearning', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ BlinksLearning: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useBlinksLearningProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useBlinksLearningProgram()

  const accountQuery = useQuery({
    queryKey: ['BlinksLearning', 'fetch', { cluster, account }],
    queryFn: () => program.account.BlinksLearning.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['BlinksLearning', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ BlinksLearning: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['BlinksLearning', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ BlinksLearning: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['BlinksLearning', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ BlinksLearning: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['BlinksLearning', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ BlinksLearning: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
