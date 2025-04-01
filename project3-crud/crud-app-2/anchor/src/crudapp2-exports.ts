// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import Crudapp2IDL from '../target/idl/crudapp2.json'
import type { Crudapp2 } from '../target/types/crudapp2'

// Re-export the generated IDL and type
export { Crudapp2, Crudapp2IDL }

// The programId is imported from the program IDL.
export const CRUDAPP2_PROGRAM_ID = new PublicKey(Crudapp2IDL.address)

// This is a helper function to get the Crudapp2 Anchor program.
export function getCrudapp2Program(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...Crudapp2IDL, address: address ? address.toBase58() : Crudapp2IDL.address } as Crudapp2, provider)
}

// This is a helper function to get the program ID for the Crudapp2 program depending on the cluster.
export function getCrudapp2ProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Crudapp2 program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return CRUDAPP2_PROGRAM_ID
  }
}
