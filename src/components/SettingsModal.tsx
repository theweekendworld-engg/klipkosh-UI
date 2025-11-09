import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ProviderSelector } from './ProviderSelector';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import type { Provider, UserPreferences } from '@/lib/types';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { getAuthToken } = useAuth();
  const { toast } = useToast();
  const [provider, setProvider] = useState<Provider>('openai');
  const [model, setModel] = useState<string>('gpt-5-nano');
  const [webOrigin, setWebOrigin] = useState<string>('');

  useEffect(() => {
    // Load saved preferences from localStorage
    const saved = localStorage.getItem('klipkosh_preferences');
    if (saved) {
      try {
        const prefs: UserPreferences = JSON.parse(saved);
        setProvider(prefs.provider || 'openai');
        setModel(prefs.default_model || 'gpt-5-nano');
        setWebOrigin(prefs.web_origin || '');
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    }
  }, []);

  const handleSave = async () => {
    try {
      const preferences: UserPreferences = {
        provider,
        default_model: model,
        default_tone: 'professional',
        web_origin: webOrigin || undefined,
      };

      // Save locally
      localStorage.setItem('klipkosh_preferences', JSON.stringify(preferences));

      // Try to save to backend if user has premium
      try {
        const token = await getAuthToken();
        await api.savePreferences(preferences, token || undefined);
      } catch (error) {
        // If backend save fails, that's okay - we saved locally
        console.log('Backend save not available, using local storage');
      }

      toast({
        title: 'Settings saved',
        description: 'Your preferences have been saved',
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Failed to save settings',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your default provider and model preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <ProviderSelector
            value={provider}
            onValueChange={setProvider}
            model={model}
            onModelChange={setModel}
          />
          <div className="space-y-2">
            <Label htmlFor="web-origin">Web Origin (Optional)</Label>
            <Input
              id="web-origin"
              value={webOrigin}
              onChange={(e) => setWebOrigin(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

