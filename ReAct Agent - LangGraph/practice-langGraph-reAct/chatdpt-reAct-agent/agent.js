import { ChatGroq } from "@langchain/groq";

async function main() {
  const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
  });
}
