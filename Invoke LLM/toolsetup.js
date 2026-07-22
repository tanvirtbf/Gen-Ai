import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const completions = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
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
    ],
    tools: [
        {
            type: 'function',
            function: {
                name: 'webSearch',
                description: 'Search the latest information and realtime data on the internet',
                parameters: {
                    type: 'object',
                    
                }
            }
        }
    ]
  });
}

await main();
