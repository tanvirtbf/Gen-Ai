import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function main(){ 
  const completions = await groq.chat.completions.create({
    temperature: 0,
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are a smart personal assistant who answers the asked questions. 
        You have access to following tools: 
        1. webSearch({ query }: {query: string}) // Search the latest information and realtime data on the internet.`
      },
      {
        role: 'user',
        content: 'When was Iphone 17 Launched?'
      }
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'webSearch',
          description: 'Search the latest information and realtime data on the internet.',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query to perform search on.'
              }
            },
            required: ['query']
          },
        }
      }
    ],
    tool_choice: 'auto'
  })

  const toolCalls = completions.choices[0].message.tool_calls 

  if(!toolCalls) {
    console.log(`AI Assistant Say : ${completions.choices[0].message.content}`)

    return 
  }

  for(let tool of toolCalls) {
    console.log('tools: ', tool)
    const functionName = tool.function.name
    const argumentsObject = JSON.parse(tool.function.arguments)
    console.log(functionName)
    console.log(argumentsObject.query)

    if(functionName === 'webSearch') {
      const finalResult = webSearch(argumentsObject)
      console.log('final result : ', finalResult)
      return 
    }
  }

  // console.log('result : ', JSON.stringify(completions.choices[0].message, null , 2))
}

main()

 function webSearch({query}) {
  console.log('query : ', query)

  return 'Iphone 17 Launch in 10 March 2026'
}