import {
  ActionGetResponse,
  ActionPostRequest,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Votingdapp } from "@/../anchor/target/types/votingdapp";
import { Program, BN } from "@coral-xyz/anchor";

const IDL = require("../../../../anchor/target/idl/votingdapp.json");

export const OPTIONS = GET;

export async function GET(req: Request) {
  const actionMetadata: ActionGetResponse = {
    icon: "https://imgs.search.brave.com/3n2gCGH1XGkA7Akuar9b6Ic5rEl4krr1IqpkOpAyBw8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/b2t4LmNvbS9jZG4v/bmZ0L2ZpbGVzL2Rm/Yzc3MDIxLTQxNDIt/NGMyZi1iZjNkLTU1/NzE0OGExMjkxNS53/ZWJwL3R5cGU9bGlz/dA",
    title: "who is your favourite warrior",
    description: "vote between shinobi and samurai",
    label: "vote",
    links: {
      actions: [
        {
          type: "transaction",
          label: "Vote for Shinobi",
          href: "/api/vote?candidate=Shinobi",
        },
        {
          type: "transaction",
          label: "Vote for Samurai",
          href: "/api/vote?candidate=Samurai",
        },
      ],
    },
  };
  return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const candidate = url.searchParams.get("candidate");
  console.log("✅ the candidate is : ", candidate);

  if (candidate != "Samurai" && candidate != "Shinobi") {
    return new Response("Invalid Candidate", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const program: Program<Votingdapp> = new Program(IDL, { connection });
  const body: ActionPostRequest = await request.json();
  let voter;

  try {
    voter = new PublicKey(body.account);
  } catch (error) {
    return new Response("Invalid account", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
  const instruction = await program.methods
    .vote(candidate, new BN(1))
    .accounts({
      signer: voter,
    })
    .instruction();

  const blockhash = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: voter,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  }).add(instruction);

  const response = await createPostResponse({
    fields: {
      transaction: transaction,
      type: "transaction",
    },
  });

  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
}
