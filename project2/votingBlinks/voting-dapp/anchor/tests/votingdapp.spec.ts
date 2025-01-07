import {Program} from '@coral-xyz/anchor'
import { PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
import * as anchor from '@coral-xyz/anchor';
const IDL = require("../target/idl/votingdapp.json")

const votingProgramAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")

describe('votingdapp', () => {

  let context;
  let provider;
  let votingProgram : Program<Votingdapp>;

  beforeAll(async()=> {
    context = await startAnchor("",[{name:"votingdapp",programId:votingProgramAddress}],[])
    provider = new BankrunProvider(context);

    votingProgram = new Program<Votingdapp>(
     IDL,
     provider
   )
  })

  it("initializes the poll", async() => {
     

    await votingProgram.methods.initalizePoll(
      new anchor.BN(1),"what is your favourite flavour ?", new anchor.BN(0),new anchor.BN(1836080953)).rpc();

      const [pollAdress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer,'le',8)], votingProgramAddress)

      const poll = await votingProgram.account.poll.fetch(pollAdress)
      console.log("✅ the poll address is : ", poll);

      expect(poll.pollId.toNumber()).toEqual(1);
      expect(poll.description).toEqual("what is your favourite flavour ?");
      expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  },)

  it("Initializes the candidate", async() => {
    await votingProgram.methods.initializeCandidate("lxsh",new anchor.BN(1)).rpc();
    await votingProgram.methods.initializeCandidate("don",new anchor.BN(1)).rpc();

    const [lxshAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8), Buffer.from("lxsh")],
      votingProgramAddress
    )

    const [donAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8), Buffer.from("don")],
      votingProgramAddress
    )
    const lxshCandidate = await votingProgram.account.candidate.fetch(lxshAddress);
    const donCandidate = await votingProgram.account.candidate.fetch(donAddress);

    expect(lxshCandidate.candidateName).toEqual("lxsh")
    expect(lxshCandidate.candidateVotes.toNumber()).toEqual(0)
    
    expect(donCandidate.candidateName).toEqual("don")
    expect(donCandidate.candidateVotes.toNumber()).toEqual(0)

    console.log("✅ the lakshay candidate : ", lxshCandidate);
    console.log("✅ the don candidate : ", donCandidate);
  })

  it("vote", async () => {
      await votingProgram.methods.vote("lxsh",new anchor.BN(1)).rpc()

      const [lxshAddress] = PublicKey.findProgramAddressSync(
        [new anchor.BN(1).toArrayLike(Buffer,'le',8), Buffer.from("lxsh")],
        votingProgramAddress
      )
      const lxshCandidate = await votingProgram.account.candidate.fetch(lxshAddress);
      expect(lxshCandidate.candidateVotes.toNumber()).toEqual(1);
  })
})
