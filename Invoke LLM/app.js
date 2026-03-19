import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });

async function main() {
  const messages = [
    {
      role: "system",
      content: `You are a smart personal assistant who answers the asked questions. 
      You have access to following tools: 
      1. webSearch({ query }: {query: string}) // Search the latest information and realtime data on the internet.`,
    },
    {
      role: "user",
      content: "What is the current temparature in dhaka ? ",
    },
  ];
  while (true) {
    const completions = await groq.chat.completions.create({
      temperature: 0,
      model: "llama-3.3-70b-versatile",
      // response_format: {'type': 'json_object'},
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Search the latest information and realtime data on the internet.",
            parameters: {
              // JSON Schema object
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to perform search on.",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    messages.push(completions.choices[0].message);

    const toolCall = completions.choices[0].message.tool_calls;

    if (!toolCall) {
      console.log(
        `AI Assistant Says : ${completions.choices[0].message.content}`,
      );

      break;
    }

    for (const tool of toolCall) {
      const functionName = tool.function.name;
      const argumentsObject = tool.function.arguments;

      if (functionName === "webSearch") {
        const result = await webSearch(JSON.parse(argumentsObject));
        // console.log(result);

        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: result,
        });
      }
    }

    console.log(
      "result: ",
      JSON.stringify(completions.choices[0].message.content, null, 2),
    );
  }
}

main();

async function webSearch({ query }) {
  // Here We will do tavily api call
  console.log('webSearch...')

  // console.log("query : ", query);

  const response = await tvly.search(query);
  const finalResult = response.results.map((item) => item.content).join("/n/n");
  // console.log('final result : ', finalResult)

  return finalResult;
}
