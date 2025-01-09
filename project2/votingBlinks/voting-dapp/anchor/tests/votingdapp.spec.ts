import {Program} from '@coral-xyz/anchor'
import { PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import * as anchor from '@coral-xyz/anchor';
const IDL = require("../target/idl/votingdapp.json")

const votingProgramAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")

describe('votingdapp', () => {

  let context;
  let provider;
  anchor.setProvider(anchor.AnchorProvider.env())
  let votingProgram =  anchor.workspace.votingdapp as Program<Votingdapp>;

  beforeAll(async()=> {
//     context = await startAnchor("",[{name:"votingdapp",programId:votingProgramAddress}],[])
//     provider = new BankrunProvider(context);
// ``  
//     votingProgram = new Program<Votingdapp>(
//      IDL,
//      provider
//    )
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
    await votingProgram.methods.initializeCandidate("Samurai",new anchor.BN(1)).rpc();
    await votingProgram.methods.initializeCandidate("Shinobi",new anchor.BN(1)).rpc();

    const [SamuraiAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8), Buffer.from("Samurai")],
      votingProgramAddress
    )

    const [ShinobiAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8), Buffer.from("Shinobi")],
      votingProgramAddress
    )
    const SamuraiCandidate = await votingProgram.account.candidate.fetch(SamuraiAddress);
    const ShinobiCandidate = await votingProgram.account.candidate.fetch(ShinobiAddress);

    expect(SamuraiCandidate.candidateName).toEqual("Samurai")
    expect(SamuraiCandidate.candidateVotes.toNumber()).toEqual(0)
    
    expect(ShinobiCandidate.candidateName).toEqual("Shinobi")
    expect(ShinobiCandidate.candidateVotes.toNumber()).toEqual(0)

    console.log("✅ the smaruai candidate : ", SamuraiCandidate);
    console.log("✅ the shinobi candidate : ", ShinobiCandidate);
  })

  it("vote", async () => {
      await votingProgram.methods.vote("Samurai",new anchor.BN(1)).rpc()

      const [SamuraiAddress] = PublicKey.findProgramAddressSync(
        [new anchor.BN(1).toArrayLike(Buffer,'le',8), Buffer.from("Samurai")],
        votingProgramAddress
      )
      const SamuraiCandidate = await votingProgram.account.candidate.fetch(SamuraiAddress);
      expect(SamuraiCandidate.candidateVotes.toNumber()).toEqual(1);
  })
})
