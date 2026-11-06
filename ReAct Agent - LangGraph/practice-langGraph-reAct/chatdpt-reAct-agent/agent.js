import { ChatGroq } from "@langchain/groq";
import { TavilySearch } from "@langchain/tavily";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

async function main() {
  // LLM setup
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
  });

  // Tool Setup
  const search = new TavilySearch({
    maxResults: 5,
    topic: "general",
  });

  const calenderEvents = tool(
    async ({ query }) => {
      // Google calender logic goes...

      return JSON.stringify([
        { title: "Meeting with sujoy", date:'6 November 2026', time: "2 PM", location: "Gmeet" },
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

  // ReAct Agent Setup
  const agent = createReactAgent({
    llm: model,
    tools: [search, calenderEvents],
    // temperature: 2,
  });

  // Agent Invoked
  const result = await agent.invoke({
    messages: [
      {
        role: "system",
        content: `You are a personal assistant. Use provided tools to get the information if you don't have it. Current Date and time : ${new Date().toUTCString()}`,
      },
      {
        role: "user",
        content: "Do i have any meeting for tomorrow?",
      },
    ],
  });

  console.log("Result: ", result.messages[result.messages.length - 1].content);
}

await main();
