import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });

async function main() {
  const rl = await readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const messages = [
    {
      role: "system",
      content: `You are e Genious Teacher who know Everything. If anyone question you then answer please. 
      You Have tool called webSearch({ query }) this is for webSearch if needed`,
    },
  ];

  while (true) {
    const question = await rl.question("You : ")
    if(question === "bye") {
        break;
    }

    messages.push({
        role: 'user',
        content: question,
    })

    while (true) {
      const completions = await groq.chat.completions.create({
        temperature: 2,
        model: "llama-3.3-70b-versatile",
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description: "Search the latest information in the internet",
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

      const toolCall = completions.choices[0].message.tool_calls 

      if(!toolCall) {
        console.log(`AI Assistent Says : ${completions.choices[0].message.content}`)
      }

      for(const tool of toolCall) {
        console.log(tool,"tool")
      }
    }
  }

  rl.close();
}

main();

async function webSearch({ query }) {
  console.log("webSearch Calling...");

  return "";
}
