import readline from "node:readline/promises";
import { writeFileSync } from "node:fs";
import { MemorySaver } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { threadId } from "node:worker_threads";

async function main() {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
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

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userQuery = await rl.question("You: ");

    if (userQuery === "bye") {
      break;
    }

    const result = await agent.invoke({
      messages: [
        {
          role: "system",
          content: `You are a personal assistant. Use provided tools to get the information if you don't have it. Current date and time : ${new Date().toUTCString()}`,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
    }, {
        configurable: { thread_id: '1' }
    });
    console.log(
      "Assistant : ",
      result.messages[result.messages.length - 1].content,
    );
  }

  const drawableGraphGraphState = await agent.getGraphAsync();
  const graphStateImage = await drawableGraphGraphState.drawMermaidPng();
  const graphStateArrayBuffer = await graphStateImage.arrayBuffer();

  const filePath = "./graphState.png";
  writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer));
}

main();
