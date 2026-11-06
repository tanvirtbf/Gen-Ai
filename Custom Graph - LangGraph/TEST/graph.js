/**
 * 1. Bring in LLM
 * 2. Build the graph
 * 3. Invoke the agent
 * 4. Add the memory
 */

import { ChatGroq } from "@langchain/groq";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";

// Tools
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

const tools = [search, calenderEvents];
const toolNode = new ToolNode(tools);

// 1. Bring in LLM
const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
}).bindTools(tools);

// 2. Build the graph
async function callModel(state) {
  console.log("Calling LLM...");
  const response = await llm.invoke(state.messages);
  console.log("Response in Call Model: ", response);
  return { messages: [response] };
}

const graph = new StateGraph(MessagesAnnotation);
