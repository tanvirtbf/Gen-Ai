import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function generate(userMessage) {
  const message = [
    {
      role: "system",
      content:
        "You are a helpful AI Assistant with web search capabilities. When the user asks about recent events or needs up-to-date information, use the available tools to search the web.",
    },
  ];

  message.push({
    role: "user",
    content: userMessage,
  });

  while (true) {
    const completions = await groq.chat.completions.create({
      temperature: 0.7,
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: message,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description: "Search the latest information on the internet",
            parameters: {
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

    message.push(completions.choices[0].message);

    console.log(completions.choices[0].message)

    const toolCall = completions.choices[0].message.tool_calls;

    if (!toolCall || toolCall.length === 0) {
      return completions.choices[0].message.content;
    }

    for (const tool of toolCall) {
      console.log("tool", tool);
      const functionName = tool.function.name;
      const functionArguments = tool.function.arguments;

      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionArguments));

        console.log("tool result : ", toolResult);

        message.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }
  }
}

async function webSearch({ query }) {
  // Here We will do tavily api call
  console.log("calling web search");

  const response = await tvly.search(query, { max_results: 5 });
  // console.log("response : ", response);

  const finalResult = response.results.map((item) => item.content).join("\n\n");
  // console.log("final result : ", finalResult);

  return finalResult;
}
