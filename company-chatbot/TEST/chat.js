import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { vectorStore } from "./prepare.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const question = await rl.question("YOU: ");
    if (question === "/bye") {
      break;
    }

    console.log(question);

    // Retrieval Step
    const relevantChunks = await vectorStore.similaritySearch(question, 3); // 3 holo number of chunk . mane holo relevant koyta chunk return korbe

    // console.log("relevant chunks :", relevantChunks);

    const context = relevantChunks
      .map((chunk) => chunk.pageContent)
      .join("\n\n");

    // console.log("Context : ", context);

    const SYSTEM_PROMPT = `You are an assistant for question answering tasks. Use the following relevant pieces of retrived context to answer the question. If you don't kow the answer, say I don't know. `;

    const userQuery = `Question: ${question}
    Relevant Context: ${context}
    Answer: `;

    const completions = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
    });

    console.log("Assistant : ", completions.choices[0].message.content);
  }

  rl.close();
}

await chat();
