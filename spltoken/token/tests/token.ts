import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Token } from "../target/types/token";
import { Keypair } from "@solana/web3.js";

describe("token", () => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const mintKeypair = Keypair.generate()
  const program = anchor.workspace.token as Program<Token>;
  const wallet = provider.wallet;

  it("it initalizes mint account ", async () => {


    const tx = await program.methods.createMint().accounts({
      mint: mintKeypair.publicKey,
      signer: wallet.publicKey
    })
      .signers([mintKeypair])
      .rpc({ commitment: "confirmed" })

    console.log(" ✅here is the signature : ", tx)

  });

  it("it creates mint account using pda ", async () => {
    const tx = await program.methods.createMintPda().accounts({
      signer: wallet.publicKey,
    }).rpc({ commitment: "confirmed" })

    console.log("✅ your signature : ", tx)
  })

  it("it creates token account :", async () => {
    const tx = await program.methods.createTokenAccount().accounts({
      signer: wallet.publicKey,
      mint: mintKeypair.publicKey
    }).rpc({ commitment: "confirmed" })
  })
});
