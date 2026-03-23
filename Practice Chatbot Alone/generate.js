import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });
export async function generate(userMessage) {
  const messages = [
    {
      role: "system",
      content: `You are a smart personal assistant who answers the asked questions. 
          You have access to following tools: 
          1. webSearch({ query }: {query: string}) // Search the latest information and realtime data on the internet.
          if user sayes the current time then resulit is :  Current date and time : ${new Date().toUTCString()} 
          However Answer should be short`,
    },
  ];

  messages.push({
    role: "user",
    content: userMessage,
  });

  while (true) {
    const completions = await groq.chat.completions.create({
      temperature: 0.1,
      model: "llama-3.3-70b-versatile",
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
      return completions.choices[0].message.content;
    }

    for (const tool of toolCall) {
      const functionName = tool.function.name;
      const functionArguments = tool.function.arguments;

      if (functionName === "webSearch") {
        const result = await webSearch(JSON.parse(functionArguments));
        return result;
      }
    }
  }
}

async function webSearch({ query }) {
  // Here We will do tavily api call
  console.log("calling web search");

  const response = await tvly.search(query, { max_results: 5 });
  // console.log("response : ", response);

  const finalResult = response.results.map((item) => item.content).join("/n/n");
  // console.log("final result : ", finalResult);

  return finalResult;
}
