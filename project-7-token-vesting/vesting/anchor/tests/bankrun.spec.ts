import * as anchor from "@coral-xyz/anchor";

import { Keypair, PublicKey } from "@solana/web3.js";
import { BanksClient, ProgramTestContext, startAnchor } from "solana-bankrun";
import { BN, Program } from "@coral-xyz/anchor";
import IDL from "../target/idl/vesting.json";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { BankrunProvider } from "anchor-bankrun";
import { Vesting } from "@project/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
// @ts-ignore
import { createMint, mintTo } from "spl-token-bankrun";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

describe("vesting smart contract tests", () => {
  const companyName = "company";
  let beneficiary: Keypair;
  let context: ProgramTestContext;
  let provider: BankrunProvider;
  let program: Program<Vesting>;
  let banksClient: BanksClient;
  let employer: Keypair;
  let mint: PublicKey;
  let beneficiaryProvider: BankrunProvider;
  let program2: Program<Vesting>;
  let vestingAccountKey: PublicKey;
  let treasuryTokenAccount: PublicKey;
  let employeeAccount: PublicKey;

  beforeAll(async () => {
    beneficiary = new anchor.web3.Keypair();

    // set up bankrun

    //  we have added fixtures so the path is empty...⚠️
    context = await startAnchor(
      "",
      [{ name: "vesting", programId: new PublicKey(IDL.address) }],
      [
        {
          address: beneficiary.publicKey,
          info: {
            lamports: 1_000_000_000,
            data: new Uint8Array(),
            owner: SYSTEM_PROGRAM_ID,
            executable: false,
          },
        },
      ]
    );

    provider = new BankrunProvider(context);
    anchor.setProvider(provider);

    program = new Program<Vesting>(IDL as Vesting, provider);

    banksClient = context.banksClient;
    employer = provider.wallet.payer;

    // create a new mint
    mint = await createMint(banksClient, employer, employer.publicKey, null, 2);

    // generate a new keypair for the beneficiary
    beneficiaryProvider = new BankrunProvider(context);
    beneficiaryProvider.wallet = new NodeWallet(beneficiary);

    program2 = new Program<Vesting>(IDL as Vesting, beneficiaryProvider);

    [vestingAccountKey] = PublicKey.findProgramAddressSync(
      [Buffer.from(companyName)],
      program.programId
    );

    [treasuryTokenAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("vesting_treasury"), Buffer.from(companyName)],
      program.programId
    );

    [employeeAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("employee_vesting"),
        beneficiary.publicKey.toBuffer(),
        vestingAccountKey.toBuffer(),
      ],
      program.programId
    );
  });

  it("should create a vesting account ", async () => {
    const tx = await program.methods
      .createVestingAccount(companyName)
      .accounts({
        signer: employer.publicKey,
        mint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    const vestingAccountData = await program.account.vestingAccount.fetch(
      vestingAccountKey,
      "confirmed"
    );
    console.log("vesting account data : ", vestingAccountData);
    console.log("create vesting account : ", tx);
  });

  it("should fund the treasury token account", async () => {
    const amount = 10_000 * 10 ** 9;
    const mintTx = await mintTo(
      banksClient,
      employer,
      mint,
      treasuryTokenAccount,
      employer,
      amount
    );
    console.log("Mint treasury token account : ", mintTx);
  });
});
