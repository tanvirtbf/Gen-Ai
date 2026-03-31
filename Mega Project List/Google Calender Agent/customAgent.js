import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import * as z from "zod";

const search = new TavilySearch({
  maxResults: 3,
  topic: "general",
});

const calenderEvents = tool(
  async () => {
    return JSON.stringify([
      { title: "Meeting for our client", time: "2PM", location: "Dhaka" },
    ]);
  },
  {
    name: "get-calender-tools",
    description: "Call to get the calender events",
    schema: z.object({
      query: z.string().describe("The query to use in calender event search"),
    }),
  },
);

const tools = [search, calenderEvents];
const toolNode = new ToolNode(tools);

const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  maxTokense: undefined,
  maxRetries: 3,
  temperature: 0.2,
}).bindTools(tools);

async function callNode(state) {
  const response = await llm.invoke(state.messages);
  return { messages: [response] };
}

function shouldChoice(state) {
  console.log("state: ", state);
  if (state.messages[state.messages.length - 1].tool_calls.length > 0) {
    return "toolNode";
  } else {
    return "__end__";
  }
}

const graph = new StateGraph(MessagesAnnotation)
  .addNode("callNode", callNode)
  .addNode("toolNode", toolNode)
  .addEdge("__start__", "callNode")
  .addEdge("toolNode", "callNode")
  .addConditionalEdges("callNode", shouldChoice);

const app = graph.compile();

async function main() {
  const result = await app.invoke({
    messages: [
      {
        role: "user",
        content: "what is the current weather in dhaka ? ",
      },
    ],
  });

  console.log("result: ", result.messages[result.messages.length - 1].content);
}

main();
