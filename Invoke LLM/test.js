import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const completions = await groq.chat.completions.create({
    temperature: 0,
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: "You are a smart AI Assistant who answers the asked question",
      },
      {
        role: "user",
        content: "Hi",
      },
    ],
  });

  console.log(completions.choices[0].message.content);
}

await main();
























// import "dotenv/config"
// import Groq from "groq-sdk"
// import { tavily } from "@tavily/core"

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
// const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY })

// async function main () {
//   const completions = await groq.chat.completions.create({
//     temperature: 0.2,
//     model: 'openai/gpt-oss-120b',
//     messages: [
//       {
//         role: 'system',
//         content: 'You are a smart Personal Assistant who answers the asked question'
//       },
//       {
//         role: 'user',
//         content: 'What is the current weather in Dhaka?'
//       }
//     ],
//     tools: [
//       {
//         type: 'function',
//         function: {
//           name: 'webSearch',
//           description: 'Search the latest information and realtime data on the internet',
//           parameters: {
//             type: 'object',
//             properties: {
//               query: {
//                 type: 'string',
//                 desciption: 'The search query to perform search on',
//               }
//             },
//             required: ['query']
//           }
//         }
//       }
//     ],
//     tool_choice: 'auto'
//   })

//   // console.log('Result : ', completions.choices[0].message.tool_calls)

//   const toolCall = completions.choices[0].message.tool_calls

//   if(!toolCall) {
//     // console.log("Result : ", completions.choices[0].message.content)
//     return
//   }

//   for(let tool of toolCall) {
//     const functionName = tool.function.name;
//     const functionParams = JSON.parse(tool.function.arguments)

//     if(functionName==="webSearch") {
//       const result = await webSearch(JSON.parse(tool.function.arguments))
//       // console.log("Result : ", result)
//       return;
//     }
//   }

// }

// await main();

// async function webSearch({ query }) {

//   const response = await tvly.search(query)
//   console.log("Response : ", response)

//   return 'Hello World from webSearch!'
// }
