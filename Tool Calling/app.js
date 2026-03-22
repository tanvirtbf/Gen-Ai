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
      content: `You are a smart personal assistant who answers the asked questions. 
          You have access to following tools: 
          1. webSearch({ query }: {query: string}) // Search the latest information and realtime data on the internet.
          if user sayes the current time in dhaka then resulit is :  Current date and time : ${new Date().toUTCString()}`,
    },
  ];

  while (true) {
    const question = await rl.question("You : ");
    if (question === "bye") {
      break;
    }
    messages.push({
      role: "user",
      content: question,
    });

    while (true) {
      const completions = await groq.chat.completions.create({
        temperature: 0,
        model: "llama-3.3-70b-versatile",
        // response_format: {'type': 'json_object'},
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description:
                "Search the latest information and realtime data on the internet.",
              parameters: {
                // JSON Schema object
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

      messages.push(completions.choices[0].message);

      const toolCalls = completions.choices[0].message.tool_calls;

      if (!toolCalls) {
        console.log(`Assistant: ${completions.choices[0].message.content}`);
        break;
      }

      for (const tool of toolCalls) {
        console.log("tool", tool);
        const functionName = tool.function.name;
        const functionParams = tool.function.arguments;

        if (functionName === "webSearch") {
          const toolResult = await webSearch(JSON.parse(functionParams));
          console.log("tool Result : ", toolResult);

          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: toolResult,
          });
        }
      }

      // console.log(
      //   "result: ",
      //   JSON.stringify(completions.choices[0].message, null, 2),
      // );
    }
  }

  rl.close()
}

main();

async function webSearch({ query }) {
  // Here We will do tavily api call
  console.log("calling web search");

  const response = await tvly.search(query, { max_results: 5 });
  // console.log("response : ", response);

  const finalResult = response.results.map((item) => item.content).join("/n/n");
  // console.log("final result : ", finalResult);

  return finalResult;
}
