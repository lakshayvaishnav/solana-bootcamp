import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";
import { NextApiRequest, NextApiResponse } from "next";


export async function GET(req: NextApiRequest, res: NextApiResponse) {
//   await runMiddleware(req, res, cors);
  const actionMetadata: ActionGetResponse = {
    icon: "",
    title: "what is your favourtie flavour",
    description: "choose between choco and strawberry",
    label: "vote",
  };
  return Response.json(actionMetadata,{headers:ACTIONS_CORS_HEADERS});
}
