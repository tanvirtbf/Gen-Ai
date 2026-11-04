import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from '@langchain/langgraph/prebuilt'

async function main() {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
  });

  const agent = createReactAgent({
    llm: model,
    tools: []
  })

  const result = await agent.invoke({
    messages: [
        {
            role: 'user',
            content: 'Hi, My name is Tanvir'
        },
    ],
  })

  console.log("Result: ", result.messages[result.messages.length-1].content)
}

main();
