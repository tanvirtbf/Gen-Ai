import "dotenv/config";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tavily = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function main() {
  const completions = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `You are a smart personal assistant who answers the asked questions. 
        You have access to following tools: 
        1. searchWeb({query}: {query: string}) // Search the latest information and realtime data on the internet`,
      },
      {
        role: "user",
        content: "What is the current weather in dhaka ?",
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "webSearch",
          description:
            "Search the latest information and realtime data on the internet",
          parameters: {
            type: "object",
            query: {
              type: "string",
              description: "The search query to perform search on",
            },
          },
          required: ["query"],
        },
      },
    ],
  });

  const toolCalls = completions.choices[0].message.tool_calls;

  if(!toolCalls) {
    console.log(`Assistant : ${completions.choices[0].message.content}`)

    return 
  }

  for(const tool of toolCalls) {
    console.log(JSON.stringify(completions.choices[0].message.tool_calls))
  }



  // console.log(completions.choices[0].message);

  
}

await main();
