import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Crudapp2 } from '../target/types/crudapp2'

describe('crudapp2', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Crudapp2 as Program<Crudapp2>

  const crudapp2Keypair = Keypair.generate()

  it('Initialize Crudapp2', async () => {
    await program.methods
      .initialize()
      .accounts({
        crudapp2: crudapp2Keypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([crudapp2Keypair])
      .rpc()

    const currentCount = await program.account.crudapp2.fetch(crudapp2Keypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Crudapp2', async () => {
    await program.methods.increment().accounts({ crudapp2: crudapp2Keypair.publicKey }).rpc()

    const currentCount = await program.account.crudapp2.fetch(crudapp2Keypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Crudapp2 Again', async () => {
    await program.methods.increment().accounts({ crudapp2: crudapp2Keypair.publicKey }).rpc()

    const currentCount = await program.account.crudapp2.fetch(crudapp2Keypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Crudapp2', async () => {
    await program.methods.decrement().accounts({ crudapp2: crudapp2Keypair.publicKey }).rpc()

    const currentCount = await program.account.crudapp2.fetch(crudapp2Keypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set crudapp2 value', async () => {
    await program.methods.set(42).accounts({ crudapp2: crudapp2Keypair.publicKey }).rpc()

    const currentCount = await program.account.crudapp2.fetch(crudapp2Keypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the crudapp2 account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        crudapp2: crudapp2Keypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.crudapp2.fetchNullable(crudapp2Keypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
