












































// import readline from "node:readline/promises";
// import "dotenv/config";
// import Groq from "groq-sdk";
// import { tavily } from "@tavily/core";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });

// async function main() {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   let messages = [
//     {
//       role: "system",
//       content: `You are a smart AI Assistant who answers the asked questions
      
//       You have access to following tools: 
//       1. webSearch({ query }: { query: string }) // search the latest information and realtime data on the internet

//       current datetime : ${new Date().toUTCString()}
//       `,
//     },
//     // {
//     //   role: "user",
//     //   content: "Hi",
//     // },
//   ];

//   while (true) {
//     const question = await rl.question("You: ");

//     if (question === "bye") {
//       break;
//     }

//     messages.push({
//       role: "user",
//       content: question,
//     });

//     while (true) {
//       const completions = await groq.chat.completions.create({
//         temperature: 0,
//         model: "openai/gpt-oss-120b",
//         messages: messages,
//         tools: [
//           {
//             type: "function",
//             function: {
//               name: "webSearch",
//               description:
//                 "Search the latest information and realtime data on the internet",
//               parameters: {
//                 type: "object",
//                 properties: {
//                   query: {
//                     type: "string",
//                     desciption: "The search query to perform search on",
//                   },
//                 },
//                 required: ["query"],
//               },
//             },
//           },
//         ],
//         tool_choice: "auto",
//       });

//       messages.push(completions.choices[0].message);

//       const toolCall = completions.choices[0].message.tool_calls;
//       if (!toolCall) {
//         console.log("Result : ", completions.choices[0].message.content);
//         break;
//       }

//       for (let tool of toolCall) {
//         // console.log(tool);
//         const functionName = tool.function.name;
//         const functionParams = JSON.parse(tool.function.arguments);
//         if (functionName === "webSearch") {
//           const response = await webSearch(functionParams);
//           // console.log("Result: ", response);

//           messages.push({
//             tool_call_id: tool.id,
//             role: "tool",
//             name: functionName,
//             content: response,
//           });
//         }
//       }
//     }
//   }

//   rl.close();
// }

// await main();

// async function webSearch({ query }) {
//   console.log("Calling web Search...");
//   const response = await tvly.search(query, { max_results: 3 });

//   const toolResult = response.results.map((res) => res.content).join("\n\n");
//   // console.log(toolResult);

//   return toolResult;
// }
