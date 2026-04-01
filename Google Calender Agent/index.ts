import { ChatGroq } from "@langchain/groq";
const tools: any = [];

const model = new ChatGroq({
  temperature: 2,
  model: "openai/gpt-oss-120b",
}).bindTools(tools);
