import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function main(){
  const completions = await groq.chat.completions.create({
    temperature: 0.2,
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are Jarvis, a smart review grader . Your task is to analyse given review and return the sentiment. Classify the review as positive, neutral or negative. You must return the result in valid JSON structure.
        example : {"Sentiment:", "true" }`
      },
      {
        role: 'user',
        content: `Tell me about a popular smartphone product`
      }
    ]
  })

  console.log(completions.choices[0].message.content)
}

main()