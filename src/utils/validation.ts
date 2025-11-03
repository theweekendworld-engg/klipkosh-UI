const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function isValidYouTubeUrl(url: string): boolean {
  return YOUTUBE_URL_REGEX.test(url.trim());
}

export function validateTranscriptSize(transcript: string, maxSizeBytes: number = 500000): {
  valid: boolean;
  error?: string;
} {
  const sizeBytes = new Blob([transcript]).size;

  if (sizeBytes > maxSizeBytes) {
    return {
      valid: false,
      error: `Transcript is too large (${(sizeBytes / 1024).toFixed(1)}KB). Maximum size is ${(maxSizeBytes / 1024).toFixed(0)}KB.`,
    };
  }

  return { valid: true };
}

