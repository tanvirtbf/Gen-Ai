import "dotenv/config";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const messages = [
  {
    role: "system",
    content: `You are a smart personal assistant who answers the asked questions. 
        You have access to following tools: 
        1. searchWeb({query}: {query: string}) // Search the latest information and realtime data on the internet`,
  },
  {
    role: "user",
    content: "What is the current weather in dhaka?",
  },
];

async function main() {
  const completions = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 1,
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
                description: "The search query to perform search on",
              },
            },
            required: ["query"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  console.log('message 1 : ', JSON.stringify(completions.choices[0].message))
  messages.push(completions.choices[0].message)
  console.log('message 2 : ', JSON.stringify(completions.choices[0].message))

  const toolCalls = completions.choices[0].message.tool_calls;

  if (!toolCalls) {
    console.log(`Assistant: ${completions.choices[0].message.content}`);

    return;
  }

  for (const tool of toolCalls) {
    console.log("tools: ", tool);
    const functionName = tool.function.name;
    const params = tool.function.arguments;

    if (functionName === "webSearch") {
      const result = await webSearch(JSON.parse(params));
      // console.log(result);

      messages.push({
        tool_call_id: tool.id,
        role: 'tool',
        name: functionName,
        content: result
      })
    }
  }

  const completions2 = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 1,
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
                description: "The search query to perform search on",
              },
            },
            required: ["query"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  // console.log(JSON.stringify(completions2.choices[0].message, null, 2));
}

await main();

async function webSearch({ query }) {
  // Here we will do tavily api call

  const response = await tvly.search(query, { maxResults: 5 });
  // console.log("response: ", response);

  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
  // console.log("final result", finalResult);

  return finalResult;
}

















// import "dotenv/config";
// import Groq from "groq-sdk";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// async function main() {
//   const completions = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     temperature: 1, // range = 0-2
//     // top_p: 0.5, // range = 0-1
//     max_completion_tokens: 1000,
//     frequency_penalty: 2,
//     presence_penalty: 1,
//     messages: [
//       {
//         role: "system",
//         content: `You are Jarvis. A smart review grader. Your task is to analyse given review and return the sentiment. Classify the review as positive, neutral or negative. You must return the result in valid JSON structure
//         example: { "sentiment" : "Negative" }`,
//       },
//       {
//         role: "user",
//         content: `Review: These headphones arrived quickly and look great, but the left earcup stopped working after a week.
//         Sentiment: `,
//       },
//     ],
//   });

//   console.log("completions: ", completions.choices[0].message.content);
// }

// main();
