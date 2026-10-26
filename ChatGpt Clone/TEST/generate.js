import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import "dotenv/config";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function generate(text) {
  const messages = [
    {
      role: "system",
      content: "You are a smart AI Assistant who answers the asked question",
    },
    {
      role: "user",
      content: text,
    },
  ];

  while (true) {
    const completions = await groq.chat.completions.create({
      temperature: 0,
      model: "openai/gpt-oss-120b",
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Search the latest information and realtime data on the internet",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  desciption: "The search query to perform search on",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    messages.push(completions.choices[0].message);

    const toolCall = completions.choices[0].message.tool_calls;

    if (!toolCall) {
      return completions.choices[0].message.content;
    }

    for (let tool of toolCall) {
      const functionName = tool.function.name;
      const functionParam = JSON.parse(tool.function.arguments);

      if (functionName === "webSearch") {
        const response = await webSearch(functionParam);
        
        messages.push({
            tool_call_id: tool.id,
            role: 'assistant',
            name: functionName,
            content: response
        })
      }
    }
  }
}

async function webSearch({ query }) {
  const res = await tvly.search(query, { max_results: 3 });

  return res.results.map((response) => response.content).join("\n\n");
}
