import { ChatGroq } from "@langchain/groq";
import { TavilySearch } from "@langchain/tavily";
import { createAgent } from "langchain";

async function main() {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 3,
  });

  const search = new TavilySearch({
    maxResults: 3,
    topic: "general",
  });

  const agent = createAgent({
    model: model,
    tools: [search],
  });

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "Hi",
      },
    ],
  });

  console.log(
    "Assistant: ",
    result.messages[result.messages.length - 1].content,
  );
}

main();
