





// import Groq from "groq-sdk";
// import { z } from "zod";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })


// async function main() {
//   try {
//     const completions = await groq.chat.completions.create({
//       temperature: 1,
//       // top_p: 0.2,
//       // stop: 'gative',
//       // max_completion_tokens: 1000,
//       // frequency_penalty: 2,
//       // presence_penalty: 2,
//       response_format: { type: "json_object" },
//       model: "llama-3.3-70b-versatile",
//       messages: [
//         {
//           role: "system",
//           content: `You are Jarvis, a smart review grader . Your task is to analyse given review and return the sentiment. Classify the review as positive, neutral or negative. You must return the result in valid JSON structure. 
//           example : {}`,
//         },
//         {
//           role: "user",
//           content: "Tell me about a popular smartphone product",
//         },
//       ],
//     });

//     // Extract the response
//     const responseContent = completions.choices[0].message.content;
//       console.log(completions.choices[0].message.content);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       console.error("Schema Validation failed: ", error.errors);
//     } else {
//       console.error("Error", error);
//     }
//   }
// }

// main();
