import Groq from "groq-sdk";
import { z } from "zod";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  description: z.string(),
  in_stock: z.boolean(),
  tags: z.array(z.string()).default([]),
});

const systemPrompt = `
You are a product catelog assistant. When asked about products,  always respond with valid JSON objects that match this structure: 
{
    "id": "string",
    "name": "string",
    "price": number,
    "description": "string",
    "in_stock": boolean,
    "tags": ["string"]
}
    Your response should ONLY contain the JSON object and nothing else.
`;

async function main() {
  try {
    const completions = await groq.chat.completions.create({
      temperature: 1,
      // top_p: 0.2,
      // stop: 'gative',
      // max_completion_tokens: 1000,
      // frequency_penalty: 2,
      // presence_penalty: 2,
      response_format: { type: "json_object" },
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: "Tell me about a popular smartphone product",
        },
      ],
    });

    // Extract the response
    const responseContent = completions.choices[0].message.content;

    // Parse and validate JSON
    const jsonData = JSON.parse(responseContent || "");
    const validatedData = ProductSchema.parse(jsonData);

    console.log("Validation successful! Structured data:");
    console.log(JSON.stringify(validatedData, null, 2));

    return validatedData;

    //   console.log(completions.choices[0].message.content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Schema Validation failed: ", error.errors);
    } else {
      console.error("Error", error);
    }
  }
}

main();
