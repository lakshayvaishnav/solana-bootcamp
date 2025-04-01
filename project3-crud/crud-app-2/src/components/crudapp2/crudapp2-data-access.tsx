'use client'

import { getCrudapp2Program, getCrudapp2ProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useCrudapp2Program() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCrudapp2ProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCrudapp2Program(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['crudapp2', 'all', { cluster }],
    queryFn: () => program.account.crudapp2.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['crudapp2', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ crudapp2: keypair.publicKey }).signers([keypair]).rpc(),
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

export function useCrudapp2ProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCrudapp2Program()

  const accountQuery = useQuery({
    queryKey: ['crudapp2', 'fetch', { cluster, account }],
    queryFn: () => program.account.crudapp2.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['crudapp2', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ crudapp2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['crudapp2', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ crudapp2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['crudapp2', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ crudapp2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['crudapp2', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ crudapp2: account }).rpc(),
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
