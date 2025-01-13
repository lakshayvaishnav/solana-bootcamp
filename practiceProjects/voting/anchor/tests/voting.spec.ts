import { Program } from "@coral-xyz/anchor";
import { Voting } from "../target/types/voting";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const IDL = require("../target/idl/voting.json");
const votingId = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

describe("voting", () => {
  // Configure the client to use the local cluster.

  let context;
  let provider;
  let votingProgram: Program<Voting>;

  beforeAll(async () => {
    context = await startAnchor(
      "",
      [{ name: "voting", programId: votingId }],
      []
    );
    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(IDL, provider);
  });

  // it("Initializes the poll", async () => {
  //   await votingProgram.methods
  //     .initializePoll(
  //       new anchor.BN(1),
  //       "WHO IS YOUR FAV WARRIOR",
  //       new anchor.BN(0),
  //       new anchor.BN(1836080953)
  //     )
  //     .rpc();
  // });

  it("initializes the poll", async () => {
    await votingProgram.methods
      .initializePoll(
        new anchor.BN(1),
        new anchor.BN(0),
        new anchor.BN(1836080953),
        "who is your favourite shinobi ?"
      )
      .rpc();

    const [pollAdress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingId
    );

    // fetchin the on chain data...
    const poll = await votingProgram.account.poll.fetch(pollAdress);
    console.log("the poll address is : ", poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("who is your favourite shinobi ?");
  });

  it("initializes the candidate", async () => {
    await votingProgram.methods.initializeCandidate("lxsh", new anchor.BN(32));

    const [candidateAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("lxsh")],

      votingId
    );

    // const candidate = await votingProgram.account.candidate.fetch(
    //   candidateAddress
    // );
    // console.log("the candidate name is : ", candidate.name);


  });
});
