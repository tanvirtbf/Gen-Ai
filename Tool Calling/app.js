import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import { process } from "zod/v4/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });

async function main() {
  const completions = await groq.chat.completions.create({
    temperature: 0,
    model: "llama-3.3-70b-versatile",
    // response_format: {'type': 'json_object'},
    messages: [
      {
        role: "system",
        content: `You are a smart personal assistant who answers the asked questions. 
        You have access to following tools: 
        1. webSearch({ query }: {query: string}) // Search the latest information and realtime data on the internet.`,
      },
      {
        role: "user",
        content: "When was Iphone 17 Launched?  ",
      },
    ],
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

  const toolCalls = completions.choices[0].message.tool_calls;

  if (!toolCalls) {
    console.log(`Assistant: ${completions.choices[0].message.content}`);
    return;
  }

  for (const tool of toolCalls) {
    console.log("tool", tool);
    const functionName = tool.function.name;
    const functionParams = tool.function.arguments;

    if (functionName === "webSearch") {
      const toolResult = await webSearch(JSON.parse(functionParams));
      console.log("tool Result : ", toolResult);
      return toolResult;
    }
  }

  console.log(
    "result: ",
    JSON.stringify(completions.choices[0].message, null, 2),
  );
}

main();

async function webSearch({ query }) {
  // Here We will do tavily api call
  console.log("calling web search");



  return "Iphone was lauched on 20 september 2024. ";
}
