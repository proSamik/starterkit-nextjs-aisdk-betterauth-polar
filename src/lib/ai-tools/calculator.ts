import { tool } from "ai";
import { z } from "zod";
import { create, all } from "mathjs";

const math = create(all);

export const calculatorTool = tool({
  description: "Calculate a math expression",
  parameters: z.object({
    expression: z.string().describe("The math expression to calculate"),
  }),
  execute: async ({ expression }) => {
    try {
      const result = math.evaluate(expression);
      return { result: result.toString() };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: "An unknown error occurred" };
    }
  },
});
