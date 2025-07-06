import { tool } from "ai";
import { z } from "zod";

export const chartGeneratorTool = tool({
  description: "Generate data for a chart",
  parameters: z.object({
    chartType: z
      .enum(["exponential"])
      .describe("The type of chart to generate"),
    count: z
      .number()
      .max(100)
      .describe("The number of data points to generate"),
  }),
  execute: async ({ chartType, count }) => {
    switch (chartType) {
      case "exponential":
        return {
          chartType,
          data: Array.from({ length: count }, (_, i) => ({
            x: i,
            y: Math.pow(2, i),
          })),
        };
      default:
        return {
          chartType,
          error: "Unsupported chart type",
        };
    }
  },
});
