import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main(){
    const completions = await groq.chat.completions.create({
        temperature: 1,
        // top_p: 0.2,
        // stop: 'gative',
        // max_completion_tokens: 1000,
        // frequency_penalty: 2,
        // presence_penalty: 2,
        response_format: {'type': 'json_object'},
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'system',
                content: `You are a islamic scholar. You will be asked questions from the Hadith and the Quran. You will give the answers briefly. You must provide the answer in json format.`,
            },  
            {
                role: 'user',
                content: 'Should I cross my hands on my chest or below my navel during prayer?',
            }
        ]
    })

    console.log(completions.choices[0].message.content)
}

main();