import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main(){
    const completions = await groq.chat.completions.create({
        temperature: 1,
        // top_p: 0.2,
        stop: 'gative',
        max_completion_tokens: 1000,
        model: 'llama-3.3-70b-versatile',
        frequency_penalty: 2,
        presence_penalty: 2,
        messages: [
            {
                role: 'system',
                content: 'You are Tanvir. A Software Engineer and a Muslim',
            },  
            {
                role: 'user',
                content: 'Who are you?',
            }
        ]
    })

    console.log(completions.choices[0].message.content)
}

main();