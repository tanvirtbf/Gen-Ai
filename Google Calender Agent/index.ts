import { ChatGroq } from "@langchain/groq";
import { tool } from "@langchain/core/tools";
const tools: any = [];

const model = new ChatGroq({
  temperature: 2,
  model: "openai/gpt-oss-120b",
}).bindTools(tools);


const agentTool = tool(
    async () => {}, 
    {}
)