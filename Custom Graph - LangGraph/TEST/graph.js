/**
 * 1. Bring in LLM
 * 2. Build the graph
 * 3. Invoke the agent
 * 4. Add the memory
 */

import { ChatGroq } from "@langchain/groq";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";

// 1. Bring in LLM
const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
});

// 2. Build the graph
function callModel(state) {
  return state;
}

const graph = new StateGraph(MessagesAnnotation);
