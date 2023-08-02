import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
} from "openai-edge";
import { NextResponse } from "next/server";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request, res: NextResponse) {
  const { usertext } = await req.json();
  var openAIPrompt =
    'Give me a data query for OpenStreetMap that shows common things found in the OpenStreetMap database related to the term: "' +
    usertext +
    " .\n" +
    'Respond with just the "query_name" and "data" , after "data=" all should be of the querystring and no explanation.' +
    "Format your response like this: query_name= {ONE_TWO_WORD_NAME_FOR_QUERY} ||| data=[out:json][timeout:45];{INSERT_QUERY_HERE};out;>;out skel qt;\n\n" +
    "Example phrases and expected responses are:\n" +
    '"Extract all schools" within the bounding box {{bbox}}\n' +
    'query_name=schools ||| data=[out:json][timeout:45];nwr["amenity"="school"]({{bbox}});out;>;out skel qt;\n\n' +
    '"Hills that are over a height of 500 meters" within the bounding box {{bbox}}\n' +
    'query_name= Hills_over_500 ||| data=[out:json][timeout:45];nwr["natural"="peak"](if:number(t["ele"])>500)({{bbox}});out;>;out skel qt;\n\n' +
    '"Buildings" within the bounding box {{bbox}}\n' +
    'query_name= Buildings ||| data=[out:json][timeout:45];nwr["building"]({{bbox}});out;>;out skel qt;\n\n';

  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: openAIPrompt,
    },
  ];

  try {
    const initialResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      // model: "gpt-4",
      messages,
    });
    const initialResponseJson = await initialResponse.json();

    const err = new Error();
    if (initialResponse.status === 401) {
      err.name = "Invalid Api Key";
      err.cause = 401;
      throw err;
    }
    if (initialResponse.status === 429) {
      err.name = "Rate Limited";
      err.cause = 429;
      throw err;
    }

    const initialResponseMessage = initialResponseJson?.choices?.[0]?.message;

    return NextResponse.json(
      {
        osmquery: initialResponseMessage?.content
          .split("|||")[1]
          ?.replace("data=", ""),
        query_name: initialResponseMessage?.content
          .split("|||")[0]
          ?.replace("query_name=", ""),
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log(e.message, e, "error");
    return NextResponse.json(
      {
        message: e.name,
      },
      { status: e.cause }
    );
  }
}
