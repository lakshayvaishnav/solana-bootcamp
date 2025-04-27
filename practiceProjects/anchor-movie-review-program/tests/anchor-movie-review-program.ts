import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorMovieReviewProgram } from "../target/types/anchor_movie_review_program";
import { SystemProgram } from "@solana/web3.js";
import { assert, expect } from "chai";
import { getAccount } from "@solana/spl-token";

describe("anchor-movie-review-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorMovieReviewProgram as Program<AnchorMovieReviewProgram>;
  const wallet = provider.wallet;

  let movieReviewPda: anchor.web3.PublicKey;

  const TITLE = "Inception";
  const DESCRIPTION = "Amazing movie about dreams inside dreams.";
  const RATING = 5;



  it("Initializes the reward token", async () => {
    const [mint] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("mint")], program.programId)

    const tx = await program.methods.initializeTokenMint().accounts({
      mint: mint,
      systemProgram: SystemProgram.programId,
      user: wallet.publicKey
    }).rpc();
  });

  it("Can add a new movie review", async () => {
    // Derive the PDA for movie review
    [movieReviewPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(TITLE), wallet.publicKey.toBuffer()],
      program.programId
    );

    const [mint] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("mint")], program.programId)


    const tokenAccount = await anchor.utils.token.associatedAddress({
      mint,
      owner: wallet.publicKey
    });

    const tx = await program.methods.addMovieReview(TITLE, DESCRIPTION, RATING).accounts({
      initializer: wallet.publicKey,
      systemProgram: SystemProgram.programId,
      mint: mint,
      movieReview: movieReviewPda,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
      tokenAccount

    }).rpc()

    const account = await program.account.movieAccountState.fetch(movieReviewPda)
    expect(account.title).to.equal(TITLE)
    expect(account.rating).to.equal(RATING)
    expect(account.description).to.equal(DESCRIPTION)


    const userAta = await getAccount(provider.connection, tokenAccount);
    console.log("user ata amount : ", userAta.amount)
    expect(Number(userAta.amount)).to.equal(10 * Math.pow(10, 6))


  });
});
