import { ChatGroq } from "@langchain/groq";
import { tool } from "@langchain/core/tools";
import { createEventTool, getEventsTool } from "./tools";
const tools = [createEventTool, getEventsTool];

const model = new ChatGroq({
  temperature: 2,
  model: "openai/gpt-oss-120b",
}).bindTools(tools);

const agentTool = tool(async () => {}, {});
