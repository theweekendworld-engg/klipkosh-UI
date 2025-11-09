export class ApiError extends Error {
  status: number;
  type: 'rate_limit' | 'token_limit' | 'unknown';

  constructor(message: string, status: number, type?: 'rate_limit' | 'token_limit' | 'unknown') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.type = type || 'unknown';
  }

  static fromResponse(status: number, errorData: any): ApiError {
    const message = errorData?.detail || errorData?.message || `HTTP ${status}`;
    const messageLower = message.toLowerCase();
    
    // Check for token limit exceeded (400 status with "token limit exceeded" message)
    if (status === 400 && messageLower.includes('token limit')) {
      return new ApiError(message, status, 'token_limit');
    }
    
    // Check for rate limit (429 status)
    if (status === 429) {
      return new ApiError(message, status, 'rate_limit');
    }
    
    return new ApiError(message, status, 'unknown');
  }
}

