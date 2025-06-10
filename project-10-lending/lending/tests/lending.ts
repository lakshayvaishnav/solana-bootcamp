import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Lending } from "../target/types/lending";
import { clusterApiUrl, Keypair } from "@solana/web3.js";
import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";
import { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";

describe("lending smart contract test", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider)
  const connection = provider.connection;


  const signer = provider.wallet.payer;
  let usdcBankAccount: PublicKey;
  let solBankAccount: PublicKey;
  let solTokenAccount: PublicKey;
  let mintUSDC: PublicKey;
  let mintSOL: PublicKey;

  const program = anchor.workspace.lending as Program<Lending>;

  before(async () => {
    mintUSDC = await createMint(
      connection,
      signer,
      signer.publicKey,
      null,
      2
    );

    mintSOL = await createMint(
      connection,
      signer,
      signer.publicKey,
      null,
      2
    );

    [usdcBankAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), mintUSDC.toBuffer()],
      program.programId
    );

    [solBankAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), mintSOL.toBuffer()],
      program.programId
    );

    [solTokenAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), mintSOL.toBuffer()],
      program.programId
    );
  });

  it("Is initialized!", async () => {
    const txn = await program.methods.initUser(mintUSDC).accounts({
      signer: provider.publicKey
    }).rpc({
      commitment: "confirmed"
    })
    console.log(" ✅ created user account : ", txn);
  });
});
