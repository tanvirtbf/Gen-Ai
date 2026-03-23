import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });

export async function generate(userMessage, threadId) {
  const baseMessage = [
    {
      role: "system",
      content: `You are a smart personal assistant.
      If you know the answer to a question, answer it directly in plain English.
      If the answer requires real-time, local, or up-to-date information, or if you don't know the answer , use the available tools to find it.
      You have access to the following tool:
      webSearch(query: string): Use this to search the internet for current or unknown information.
      Decide when to use your own knowledge and when to use the tool.
      Do not mention the tool unless needed.
      
      Examples: 
      Q: What is the capital of France ? 
      A: The capital of France is Paris.
      
      Q: What's the weather in Mumbai right now?
      A: (use the search tool to find the latest weather)

      Q: Who is the Prime Minister of India ?
      A: The current Prime Minister of India is Narendra Modi.

      Q: Tell me the latest IT news.
      A: (use the search tool to get the latest news)

      current date and time: ${new Date().toUTCString()}
      `,
    },
  ];

  const message = cache.get(threadId) ?? baseMessage; // threadId te value thakle setaii nau noyto baseMessage er value neu

  message.push({
    role: "user",
    content: userMessage,
  });

  while (true) {
    const completions = await groq.chat.completions.create({
      temperature: 0.7,
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: message,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description: "Search the latest information on the internet",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to perform search on.",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    message.push(completions.choices[0].message);

    // console.log(completions.choices[0].message);

    const toolCall = completions.choices[0].message.tool_calls;

    if (!toolCall || toolCall.length === 0) {
      // here we end the chatbot response
      cache.set(threadId, message, 60 * 60 * 24);
      console.log("cache: ", JSON.stringify(cache.data));
      return completions.choices[0].message.content;
    }

    for (const tool of toolCall) {
      // console.log("tool", tool);
      const functionName = tool.function.name;
      const functionArguments = tool.function.arguments;

      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionArguments));

        // console.log("tool result : ", toolResult);

        message.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }
  }
}

async function webSearch({ query }) {
  // Here We will do tavily api call
  console.log("calling web search");

  const response = await tvly.search(query, { max_results: 5 });
  // console.log("response : ", response);

  const finalResult = response.results.map((item) => item.content).join("\n\n");
  // console.log("final result : ", finalResult);

  return finalResult;
}
