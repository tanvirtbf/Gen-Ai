import { ChatGroq } from '@langchain/groq'

const llm = new ChatGroq({
    model: 'llama-3.3-70b-versatile',
    temperature: 0,
})