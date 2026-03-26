import { ChatGroq } from "@langchain/groq";
import { MemorySaver } from "@langchain/langgraph";
import { TavilySearch } from "@langchain/tavily";
import { createAgent } from "langchain";

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  maxTokens: undefined,
  maxRetries: 3,
});

const search = new TavilySearch({
  maxResults: 3,
  topic: "general",
});

const checkpointer = new MemorySaver();

const agent = createAgent({
  model: model,
  tools: [search],
  checkpointer: checkpointer,
});

export async function chatAgent(query) {
  const result = await agent.invoke(
    {
      messages: [
        {
          role: "system",
          content: `You are a personal assistant. Use provided tools to get the information if you don't have it. Current date and time : ${new Date().toUTCString()}`,
        },
        {
          role: "human",
          content: query,
        },
      ],
    },
    {
      configurable: { thread_id: "1" },
    },
  );

  return result.messages[result.messages.length - 1].content;
}
