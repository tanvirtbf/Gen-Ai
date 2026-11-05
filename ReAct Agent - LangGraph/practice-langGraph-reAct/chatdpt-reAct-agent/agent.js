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
        { title: "Meeting with sujoy", time: "2 PM", location: "Gmeet" },
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
    tools: [search],
  });

  // Agent Invoked
  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "What is the current weather in dhaka?",
      },
    ],
  });

  console.log("Result: ", result.messages[result.messages.length - 1].content);
}

await main();

// import { ChatGroq } from "@langchain/groq";
// import { createReactAgent } from "@langchain/langgraph/prebuilt";
// import { TavilySearch } from "@langchain/tavily";

// async function main() {
//   const model = new ChatGroq({
//     model: "openai/gpt-oss-120b",
//     temperature: 0,
//   }); // groq er model setup hoise . mane eta amader ai agent er brain

//   const search = new TavilySearch({
//     maxResults: 5,
//     topic: "general",
//   }); // tool ready kora hocche tavily theke readymade tool

//   const agent = createReactAgent({
//     llm: model,
//     tools: [search],
//   }); // react agent setup hoise jekhane amra amader llm and tools gula diyechi

//   const result = await agent.invoke({
//     messages: [
//       {
//         role: "user",
//         content: "what is the current weather in dhaka?",
//       },
//     ],
//   }); // react agent ke question kora hocche or invoke kora hoise ekhane

//   console.log("Result: ", result.messages[result.messages.length - 1].content);
// }

// await main();
