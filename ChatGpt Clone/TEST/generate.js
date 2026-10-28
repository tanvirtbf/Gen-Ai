import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import "dotenv/config";
import NodeCache from "node-cache";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });
const cache = new NodeCache({ stdTTL: 60*60*24 })

export async function generate(text, threadId) {
  const messages = [
    {
      role: "system",
      content: `You are a smart AI assistant who answers questions clearly, accurately, and concisely.

                Follow the response style demonstrated in these examples.

                Example 1:
                User: What is JavaScript?
                Assistant: JavaScript is a programming language used to build interactive websites and applications.

                Example 2:
                User: What is Node.js?
                Assistant: Node.js is a JavaScript runtime that allows you to run JavaScript outside the browser, commonly used for backend development.

                Example 3:
                User: What is an API?
                Assistant: An API (Application Programming Interface) allows different software applications to communicate and exchange data.

                Example 4:
                User: Is React a programming language?
                Assistant: No. React is a JavaScript library used to build user interfaces.

                Always answer the user's actual question. If you are unsure about something, say so instead of making up information.`,
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
          role: "assistant",
          name: functionName,
          content: response,
        });
      }
    }
  }
}

async function webSearch({ query }) {
  const res = await tvly.search(query, { max_results: 3 });

  return res.results.map((response) => response.content).join("\n\n");
}
