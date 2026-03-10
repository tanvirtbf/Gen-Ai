import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function main(){
  const completions = await groq.chat.completions.create({
    temperature: 1, 
    model: 'llama-3.3-70b-versatile',
    response_format: {'type': 'json_object'},
    messages: [
      {
        role: 'system',
        content: `You are a teacher. your student asked some question and you must be answer it by json object data. like : 
        {
          'What is the name of the national fruit of Bangladesh?? ' : 'Jackfruit'
        }`
      },
      {
        role: 'user',
        content: 'What is the name of the Prime Minister of Bangladesh? '
      }
    ]
  })

  console.log('result: ', completions.choices[0].message.content)
}

main();






