import readline from "node:readline/promises";
import { ChatGroq } from "@langchain/groq";
import { MemorySaver } from "@langchain/langgraph";
import { TavilySearch } from "@langchain/tavily";
import { createAgent } from "langchain";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  maxTokens: undefined,
  maxRetries: 3,
});

const search = new TavilySearch({
  maxResults: 3,
  topic: "general",
});

const calenderEvents = tool(
  async ({ query }) => {
    // Google calender logic goes here..
    return JSON.stringify([
      { title: "Meeting with Tanvir", time: "2PM", location: "Dhaka" },
    ]);
  },
  {
    name: "get-calender-events",
    description: "Call to get the calender events",
    schema: z.object({
      query: z.string().describe("The query to use in calender event search"),
    }),
  },
);

const checkpointer = new MemorySaver();

const agent = createAgent({
  model: model,
  tools: [search, calenderEvents],
  checkpointer: checkpointer,
});

async function main() {
  while (true) {
    const question = await rl.question("You: ");

    if (question === "bye") {
      break;
    }

    const result = await agent.invoke(
      {
        messages: [
          {
            role: "system",
            content: `You are a personal assistant. Use provided tools to get the information if you don't have it. Current date and time : ${new Date().toUTCString()}`,
          },
          {
            role: "user",
            content: question,
          },
        ],
      },
      {
        configurable: { thread_id: "1" },
      },
    );

    console.log(
      "Assistant: ",
      result.messages[result.messages.length - 1].content,
    );
  }
}

main();
