import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const completions = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 1, // range = 0-2
    // top_p: 0.5, // range = 0-1
    max_completion_tokens: 1000,
    frequency_penalty: 2,
    presence_penalty: 1,
    messages: [
      {
        role: "system",
        content: `You are Jarvis. A smart review grader. Your task is to analyse given review and return the sentiment. Classify the review as positive, neutral or negative. You must return the result in valid JSON structure 
        example: { "sentiment" : "Negative" }`,
      },
      {
        role: "user",
        content: `Review: These headphones arrived quickly and look great, but the left earcup stopped working after a week.
        Sentiment: `,
      },
    ],
  });

  console.log("completions: ", completions.choices[0].message.content);
}

main();
