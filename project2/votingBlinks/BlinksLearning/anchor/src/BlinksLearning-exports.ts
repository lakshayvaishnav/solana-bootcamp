// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import BlinksLearningIDL from '../target/idl/BlinksLearning.json'
import type { BlinksLearning } from '../target/types/BlinksLearning'

// Re-export the generated IDL and type
export { BlinksLearning, BlinksLearningIDL }

// The programId is imported from the program IDL.
export const BLINKS_LEARNING_PROGRAM_ID = new PublicKey(BlinksLearningIDL.address)

// This is a helper function to get the BlinksLearning Anchor program.
export function getBlinksLearningProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...BlinksLearningIDL, address: address ? address.toBase58() : BlinksLearningIDL.address } as BlinksLearning, provider)
}

// This is a helper function to get the program ID for the BlinksLearning program depending on the cluster.
export function getBlinksLearningProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the BlinksLearning program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return BLINKS_LEARNING_PROGRAM_ID
  }
}
