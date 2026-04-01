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
    schema: z.object({}),
  },
);
