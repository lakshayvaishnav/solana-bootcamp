import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();

await airdropIfRequired(connection, user.publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);

console.log("Loaded user ", user.publicKey);

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

umi.use(keypairIdentity(umiUser));

console.log("set up umi instance for user ");

const collectionMint = generateSigner(umi);

console.log("collection mint : ", collectionMint);

// const transaction = await createNft(umi, {
//   mint: collectionMint,
//   name: "sujiko2",
//   symbol: "SUJ",
//   uri: "https://avatars.githubusercontent.com/u/123557766?v=4",
//   sellerFeeBasisPoints: percentAmount(0),
//   isCollection: true,
// });

// await transaction.sendAndConfirm(umi);

// const createdCollectionNft = await fetchDigitalAsset(umi, collectionMint.publicKey);

// console.log(`Created collection ✅! Addres is ${getExplorerLink("address", createdCollectionNft.mint.publicKey, "devnet")}`);
