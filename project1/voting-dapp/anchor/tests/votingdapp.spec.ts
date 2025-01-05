import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'


import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
const IDL = require("../target/idl/votingdapp.json")

const votingProgramAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")

describe('votingdapp', () => {

  it("initializes the poll", async() => {
    const context = await startAnchor("",[{name:"votingProgram",programId:votingProgramAddress}],[])
    const provider = new BankrunProvider(context);

    const voitngProgram = new Program<Votingdapp>(
      IDL,
      provider
    )
  })
  
})
