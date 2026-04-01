import { ChatGroq } from "@langchain/groq";
import { tool } from "@langchain/core/tools";
import { createEventTool, getEventsTool } from "./tools";
import { END, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import type { AIMessage } from "langchain";
const tools = [createEventTool, getEventsTool];

const model = new ChatGroq({
  temperature: 2,
  model: "openai/gpt-oss-120b",
}).bindTools(tools);

// Assistant Node
async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

// state: typeof MessagesAnnotation.State ---- er mane holo MessagesAnnotation er moddhe State er jei type sei type taii state er type

// Tool Node
const toolNode = new ToolNode(tools);

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;

  console.log('last message : ', lastMessage)

  if (lastMessage?.tool_calls?.length) {
    return "tools";
  }

  return "__end__";
}

// Build the graph
const graph = new StateGraph(MessagesAnnotation)
  .addNode("assistant", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "assistant")
  .addEdge("tools", "assistant")
  .addConditionalEdges("assistant", shouldContinue, {
    // For Debugging
    __end__: END,
    tools: "tools",
  });

const app = graph.compile();

async function main() {
  const result = await app.invoke({
    messages: [
      {
        role: "user",
        content: "Can you fixed meeting tommorow with Sujoy at 9PM? ",
      },
    ],
  });
  console.log("AI: ", result.messages[result.messages.length - 1]?.content);
}

main();
