"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function ToolDisplay({
  toolName,
  result,
}: { toolName: string; result: any }) {
  if (toolName === "calculate") {
    return (
      <div className="p-4 my-2 border rounded-lg bg-muted">
        <p className="text-sm font-semibold">Calculator Result</p>
        <p className="text-lg">{result.result || result.error}</p>
      </div>
    );
  }

  if (toolName === "generateChart" && result.data) {
    return (
      <div className="p-4 my-2 border rounded-lg bg-muted h-80">
        <p className="text-sm font-semibold">Chart: {result.chartType}</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={result.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="y" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="p-4 my-2 border rounded-lg bg-muted">
      <p className="text-sm font-semibold">Tool Result: {toolName}</p>
      <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
