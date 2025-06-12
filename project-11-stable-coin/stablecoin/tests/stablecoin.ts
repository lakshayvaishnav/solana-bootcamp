import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Stablecoin } from "../target/types/stablecoin";
import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver"
describe("stablecoin", () => {

  const program = anchor.workspace.stablecoin as Program<Stablecoin>;

  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  const connection = provider.connection;
  const wallet = provider.wallet as anchor.Wallet;

  anchor.setProvider(provider)

  const pythSolanaReceiver = new PythSolanaReceiver({
    connection: connection,
    wallet: wallet,
  })

  const SOL_PRICE_FEED_ID = "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d";
  const solUsdPriceFeedAccount = pythSolanaReceiver.getPriceFeedAccountAddress(0, SOL_PRICE_FEED_ID);

  const [collateralAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("collateral"),
    wallet.publicKey.toBuffer(),
    ],
    program.programId
  );


  it("Is initialized!", async () => {

    const tx = await program.methods.initializeConfig().accounts({}).rpc({ commitment: "confirmed" });
    console.log("✅ account initialized : ", tx);

  });

  it("Deposit Collateral and Mint USDC", async () => {
    const amountCollateral = 1_000_000_000;
    const amountToMint = 1_000_000;

    const tx = await program.methods.depositCollateralMintTokens(new anchor.BN(amountCollateral), new anchor.BN(amountToMint)).accounts({ priceUpdate: solUsdPriceFeedAccount }).rpc({ commitment: "confirmed" })

    console.log("✅ collateral deposited and tokens minted : ", tx)
  })

  it("Reddeem Collateral and Burn USDC", async () => {
    const amountCollateral = 500_000_000;
    const amountToBurn = 500_000;

    const tx = await program.methods.reddemCollateralAndBurnTokens(new anchor.BN(amountCollateral), new anchor.BN(amountToBurn)).accounts({ priceUpdate: solUsdPriceFeedAccount }).rpc({ commitment: "confirmed" })

    console.log("✅ reddeem collateral and burned tokens", tx)
  })

  it("update config", async () => {
    const tx = await program.methods.updateConfig(new anchor.BN(100)).accounts({}).rpc({ commitment: "confirmed" })
    console.log("✅ update config : ", tx);
  })

  it("Liquidate", async () => {
    const tx = await program.methods.liquidate(new anchor.BN(1)).accounts({}).rpc({ commitment: "confirmed" })
    console.log("✅ liquidate : ", tx)
  })

  it("update config ", async () => {
    const tx = await program.methods.updateConfig(new anchor.BN(1)).accounts({}).rpc({ commitment: "confirmed" })
    console.log("✅ updated config again : ", tx);
  })
});
