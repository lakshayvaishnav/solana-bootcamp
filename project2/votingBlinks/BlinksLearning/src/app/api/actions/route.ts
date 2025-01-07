import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";

export async function GET(request: Request) {
  const response: ActionGetResponse = {
    icon: "https://imgs.search.brave.com/J4Yibh2Oo_kKhTtMla-K83K2vEDjgAIWpkv22eZbzog/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90cnVz/dHdhbGxldC5jb20v/X25leHQvaW1hZ2U_/dXJsPWh0dHBzOi8v/c3RyYXBpLWNkbi50/cnVzdHdhbGxldC5j/b20vc29sYW5hX2Js/aW5rc18xX2YwMmZj/MTBlN2UucG5nJnc9/Mzg0MCZxPTc1",
    title: "sample",
    description: "sample",
    label: "click me",
  };
  const res = Response.json(response, { headers: ACTIONS_CORS_HEADERS });
  return res;
}

export async function POST(request: Request) {
  const postRequest: ActionPostRequest = await request.json();
  const userPubKey = postRequest.account;
  console.log(userPubKey);

  const response: ActionPostResponse = {
    type: "transaction",
    transaction: "",
    message: "hello " + userPubKey,
  };
  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
}
