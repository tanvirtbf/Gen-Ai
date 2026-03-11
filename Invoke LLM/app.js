import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function main(){
  const completions = await groq.chat.completions.create({
    temperature: 0, 
    model: 'llama-3.3-70b-versatile',
    // response_format: {'type': 'json_object'},
    messages: [
      {
        role: 'system',
        content: `You are a smart personal assistant who answers the asked questions`
      },
      {
        role: 'user',
        content: 'When was Iphone 17 Launched?  '
      }
    ]
  })

  console.log('result: ', completions.choices[0].message.content)
}

main();






