import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import type { Provider } from '@/lib/types';

interface ProviderSelectorProps {
  value: Provider;
  onValueChange: (value: Provider) => void;
  model?: string;
  onModelChange?: (model: string) => void;
}

const MODELS: Record<Provider, string[]> = {
  openrouter: [
    'openai/gpt-5-nano',
  ],
  openai: ['gpt-5-nano'],
};

export function ProviderSelector({
  value,
  onValueChange,
  model,
  onModelChange,
}: ProviderSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="provider">Provider</Label>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger id="provider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openrouter">OpenRouter</SelectItem>
            <SelectItem value="openai">OpenAI</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {onModelChange && (
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={model || ''} onValueChange={onModelChange}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {MODELS[value].map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

