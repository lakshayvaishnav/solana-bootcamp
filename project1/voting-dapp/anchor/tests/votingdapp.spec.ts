import {Program} from '@coral-xyz/anchor'
import { PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
import * as anchor from '@coral-xyz/anchor';
const IDL = require("../target/idl/votingdapp.json")

const votingProgramAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")

describe('votingdapp', () => {

  it("initializes the poll", async() => {
    const context = await startAnchor("",[{name:"votingdapp",programId:votingProgramAddress}],[])
    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Votingdapp>(
      IDL,
      provider
    )

    await votingProgram.methods.initalizePoll(
      new anchor.BN(1),"what is your favourite flavour ?", new anchor.BN(0),new anchor.BN(1836080953)).rpc();

      const [pollAdress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer,'le',8)], votingProgramAddress)

      const poll = await votingProgram.account.poll.fetch(pollAdress)
      console.log("✅ the poll address is : ", poll);
  },)
})
