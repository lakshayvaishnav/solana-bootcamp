import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Lending } from "../target/types/lending";
import { clusterApiUrl, Keypair } from "@solana/web3.js";
import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";
import { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
describe("lending", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider)

  const signer = provider.wallet.payer;
  const usdcAccount = Keypair.generate();

  const program = anchor.workspace.lending as Program<Lending>;
  const connection = new Connection(clusterApiUrl("devnet"))

  const pyth = new PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE");
  const pythSolanReciever = new PythSolanaReceiver({
    connection: connection,
    // @ts-ignore
    wallet: provider.wallet,

  })

  it("Is initialized!", async () => {
    const txn = await program.methods.initUser(usdcAccount.publicKey).accounts({
      signer: provider.publicKey
    }).rpc({
      commitment: "confirmed"
    })

  });
});
