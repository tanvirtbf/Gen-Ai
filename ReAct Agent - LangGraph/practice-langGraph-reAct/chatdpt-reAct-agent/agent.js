import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";

async function main() {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
  });

  const search = new TavilySearch({
    maxResults: 5,
    topic: "general",
  });

  const agent = createReactAgent({
    llm: model,
    tools: [search],
  });

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "what is the current weather in dhaka?",
      },
    ],
  });

  console.log("Result: ", result.messages[result.messages.length - 1].content);
}

await main();
