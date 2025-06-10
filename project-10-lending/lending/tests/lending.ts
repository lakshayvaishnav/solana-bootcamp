import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Lending } from "../target/types/lending";
import { clusterApiUrl, Keypair } from "@solana/web3.js";
import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";
import { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { createAccount, createMint, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN } from "bn.js";

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

    console.log("✅ provider is here : ", provider.publicKey)

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

  it("test init user ", async () => {
    const txn = await program.methods.initUser(mintUSDC).accounts({
      signer: provider.publicKey
    }).rpc({
      commitment: "confirmed"
    })
    console.log(" ✅ created user account : ", txn);
  });

  it("test Init and Fund USDC Bank", async () => {
    const initUSDCBankTx = await program.methods.initBank(new BN(1), new BN(1))
      .accounts({
        signer: provider.publicKey,
        mint: mintUSDC,
        tokenProgram: TOKEN_PROGRAM_ID
      }).rpc({ commitment: "confirmed" })

    console.log("✅ created bank account : ", initUSDCBankTx);

    const amount = 10_000 * 10 ** 9;
    const mintTx = await mintTo(
      connection,
      signer,
      mintUSDC,
      usdcBankAccount,
      provider.publicKey,
      amount
    )
    console.log("✅ mint to USDC bank signature : ", mintTx);
  })

  it("create and fund token account : ", async () => {
    const USDCTokenAccount = await createAccount(
      connection,
      signer,
      mintUSDC,
      signer.publicKey
    )

    console.log("USDC Token account created : ", USDCTokenAccount);

    const amount = 10_000 * 10 * 9;

    const mintUSDCTx = await mintTo(
      connection,
      signer,
      mintUSDC,
      USDCTokenAccount,
      signer,
      amount
    )

    console.log("✅ mint to USDC bank signature : ", mintUSDCTx)
  })

  it("test deposit", async () => {
    const depositUSDC = await program.methods.deposit(new BN(10000))
      .accounts({
        signer: provider.publicKey,
        mint: mintUSDC,
        tokenProgram: TOKEN_PROGRAM_ID
      }).rpc({ commitment: "confirmed" })
    console.log("✅ deposit usdc : ", depositUSDC)
  })

  it("Test Repay", async () => {
    const repaySOL = await program.methods
      .repay(new BN(1))
      .accounts({
        signer: provider.publicKey,
        mint: mintSOL,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    console.log("Repay SOL", repaySOL);
  });
});
