import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import type { Tone } from '@/lib/types';

interface ToneSelectorProps {
  value: Tone;
  onValueChange: (value: Tone) => void;
}

export function ToneSelector({ value, onValueChange }: ToneSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="tone">Tone</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="tone">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="casual">Casual</SelectItem>
          <SelectItem value="professional">Professional</SelectItem>
          <SelectItem value="humorous">Humorous</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

