"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODELS, ModelId } from "@/lib/ai-models";

interface ModelSelectorProps {
  value: ModelId;
  onValueChange: (value: ModelId) => void;
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(MODELS).map((modelId) => (
          <SelectItem key={modelId} value={modelId}>
            {modelId}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
