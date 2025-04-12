import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import { Tokenlottery } from "../target/types/tokenlottery";

describe("tokenlottery", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Tokenlottery as Program<Tokenlottery>;

  it("should init config", async () => {
    const initConfigIx = await program.methods
      .initializeConfig(new anchor.BN(0), new anchor.BN(1844439480), new anchor.BN(10000))
      .instruction();

    const blockhashWithContext = provider.connection.getLatestBlockhash();

    const tx = new anchor.web3.Transaction({
      feePayer: provider.wallet.publicKey,
      blockhash: (await blockhashWithContext).blockhash,
      lastValidBlockHeight: (await blockhashWithContext).lastValidBlockHeight,
    }).add(initConfigIx);

    const signature = await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [wallet.payer],{skipPreflight:true});
    console.log("✅ signature : ", signature);
  });
});
