export type Provider = 'openrouter' | 'openai';

export type Tone = 'casual' | 'professional' | 'humorous';

export interface GenerateRequest {
  youtube_url?: string;
  transcript?: string;
  title_override?: string;
  tone?: Tone;
  provider?: Provider;
  model?: string;
}

export interface JobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'done';
  created_at: string;
  updated_at: string;
  error?: string;
}

export interface JobResult {
  job_id: string;
  status: 'completed' | 'failed';
  outputs: {
    description: string;
    tags: string[];
    summary: string[];
    social_caption: string;
    hashtags?: string[];
  };
  error?: string;
}

export interface Job extends JobStatus {
  result?: JobResult['outputs'];
  video_url?: string;
  video_id?: string;
}

export interface UserPreferences {
  provider: Provider;
  default_model: string;
  default_tone: Tone;
  web_origin?: string;
}

export interface UsageStats {
  free_credits_remaining: number;
  total_generations: number;
}

