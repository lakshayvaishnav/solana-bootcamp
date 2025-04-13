import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Caller } from "../target/types/caller";
import { Target } from "../target/types/target";
import { assert } from "chai";

describe("cpi", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Anchor - generated clients for each program
  const targetProgram = anchor.workspace.Target as Program<Target>;
  const callerProgram = anchor.workspace.Caller as Program<Caller>;

  // fresh keypair
  const dataAccount = anchor.web3.Keypair.generate();

  it("Is initialize the data account in target", async () => {
    const initValue = new anchor.BN(4);
    await targetProgram.methods
      .initialize(initValue)
      .accounts({
        dataAccount: dataAccount.publicKey,
        payer: provider.wallet.publicKey,
      })
      .signers([dataAccount])
      .rpc();

    const acct = await targetProgram.account.dataAccount.fetch(
      dataAccount.publicKey
    );
    assert.ok(acct.value.eq(initValue), "should have set initial value");
  });

  it("updates via CPOI through caller", async () => {
    const newValue = new anchor.BN(123);

    // call caller.callupdate() which cpi invokes
    await callerProgram.methods
      .callUpdate(newValue)
      .accounts({
        dataAccount: dataAccount.publicKey,
      })
      .rpc();
    const acct = await targetProgram.account.dataAccount.fetch(
      dataAccount.publicKey
    );
    assert.ok(acct.value.eq(newValue));
  });
});
