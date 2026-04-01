import { tool } from "@langchain/core/tools";
import * as z from "zod";

export const createEventTool = tool(
  async () => {
    // Google calender logic goes
    return "The meeting has been created.";
  },
  {
    name: "create-event",
    description: "Call to create the calender events",
    schema: z.object({
      query: z.string().describe('The query to be used to create event into google calender')
    }),
  },
);

export const getEventsTool = tool(
    async () => {
         // Google calender logic goes
        return JSON.stringify([
            {
                title: 'Meeting with Sujoy',
                date: '26th August 2025',
                time: '2PM',
                location: 'Dhaka'
            }
        ])
    },
    {
        name: 'get-events',
        description: 'Call to get the calender events',
        schema: z.object({ query: z.string().describe('The query to be used to get events from google calender')})
    }
)
