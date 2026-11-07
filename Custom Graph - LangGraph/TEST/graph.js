/**
 * 1. Bring in LLM
 * 2. Build the graph
 * 3. Invoke the agent
 * 4. Add the memory
 */













































// import { ChatGroq } from "@langchain/groq";
// import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
// import { TavilySearch } from "@langchain/tavily";
// import { tool } from "@langchain/core/tools";
// import { ToolNode } from "@langchain/langgraph/prebuilt";
// import z from "zod";

// // Tools
// const search = new TavilySearch({
//   maxResults: 3,
//   topic: "general",
// });

// const calenderEvents = tool(
//   async ({ query }) => {
//     // Google calender logic goes here..
//     return JSON.stringify([
//       { title: "Meeting with Tanvir", time: "2PM", location: "Dhaka" },
//     ]);
//   },
//   {
//     name: "get-calender-events",
//     description: "Call to get the calender events",
//     schema: z.object({
//       query: z.string().describe("The query to use in calender event search"),
//     }),
//   },
// );

// const tools = [search, calenderEvents];
// const toolNode = new ToolNode(tools);

// // 1. Bring in LLM
// const llm = new ChatGroq({
//   model: "openai/gpt-oss-120b",
//   temperature: 0,
// }).bindTools(tools);

// // 2. Build the graph
// async function callModel(state) {
//   console.log("Calling LLM...");
//   const response = await llm.invoke(state.messages);
//   //   console.log("Response in Call Model: ", response);
//   return { messages: [response] };
// }

// // Conditional Edge
// function shouldContinue(state) {
//   console.log(
//     "State Message : ",
//     state.messages[state.messages.length - 1].tool_calls,
//   );

//   if (state.messages[state.messages.length - 1].tool_calls?.length) {
//     return "tools";
//   } else {
//     return "__end__";
//   }

//   return "__end__";
// }

// const graph = new StateGraph(MessagesAnnotation)
//   .addNode("llm", callModel)
//   .addNode("tools", toolNode)
//   .addEdge("__start__", "llm")
//   .addEdge("tools", "llm")
//   .addConditionalEdges("llm", shouldContinue);

// const app = graph.compile();

// async function main() {
//   const result = await app.invoke({
//     messages: [
//       {
//         role: "user",
//         content: "What is the current wheather in dhaka?",
//       },
//     ],
//   });

//   //   console.log(result);

//   const messages = result.messages;
//   const final = messages[messages.length - 1];
//   console.log("Final Result : ", final.content);
// }

// await main();
