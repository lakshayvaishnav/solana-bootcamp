import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {BlinksLearning} from '../target/types/BlinksLearning'

describe('BlinksLearning', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.BlinksLearning as Program<BlinksLearning>

  const BlinksLearningKeypair = Keypair.generate()

  it('Initialize BlinksLearning', async () => {
    await program.methods
      .initialize()
      .accounts({
        BlinksLearning: BlinksLearningKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([BlinksLearningKeypair])
      .rpc()

    const currentCount = await program.account.BlinksLearning.fetch(BlinksLearningKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment BlinksLearning', async () => {
    await program.methods.increment().accounts({ BlinksLearning: BlinksLearningKeypair.publicKey }).rpc()

    const currentCount = await program.account.BlinksLearning.fetch(BlinksLearningKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment BlinksLearning Again', async () => {
    await program.methods.increment().accounts({ BlinksLearning: BlinksLearningKeypair.publicKey }).rpc()

    const currentCount = await program.account.BlinksLearning.fetch(BlinksLearningKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement BlinksLearning', async () => {
    await program.methods.decrement().accounts({ BlinksLearning: BlinksLearningKeypair.publicKey }).rpc()

    const currentCount = await program.account.BlinksLearning.fetch(BlinksLearningKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set BlinksLearning value', async () => {
    await program.methods.set(42).accounts({ BlinksLearning: BlinksLearningKeypair.publicKey }).rpc()

    const currentCount = await program.account.BlinksLearning.fetch(BlinksLearningKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the BlinksLearning account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        BlinksLearning: BlinksLearningKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.BlinksLearning.fetchNullable(BlinksLearningKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
