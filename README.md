# PostPilot UI

A modern, production-ready React + TypeScript frontend for PostPilot, an AI-powered content generation tool for YouTube videos.

## Features

- 🎬 **YouTube Integration**: Paste YouTube URLs or upload transcripts
- 🤖 **AI-Powered Generation**: Generate descriptions, tags, summaries, and social captions
- 🔐 **Secure Authentication**: Clerk-based authentication
- 📊 **Real-time Job Tracking**: Poll job status with exponential backoff
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- ⚡ **Fast Development**: Powered by Vite and Bun
- ✅ **Fully Tested**: Unit and component tests with Vitest

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling (compatible with Bun)
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Clerk** for authentication
- **React Query** (TanStack Query) for server state management
- **React Router** for routing
- **Vitest** + **Testing Library** for testing

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- A Clerk account and application
- Backend API running (default: `http://localhost:8000`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd postPilot-ui
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_API_URL=http://localhost:8000
VITE_DEFAULT_PROVIDER=openrouter
VITE_ALLOWED_ORIGIN=http://localhost:3000
```

### Development

Start the development server:
```bash
bun dev
# or
npm run dev
```

The app will be available at `http://localhost:3000`.

### Building for Production

```bash
bun run build
# or
npm run build
```

The built files will be in the `dist` directory, ready for deployment to Vercel, Netlify, or any static hosting service.

### Testing

Run tests:
```bash
bun test
# or
npm test
```

Run tests with UI:
```bash
bun test:ui
# or
npm run test:ui
```

## Project Structure

```
postPilot-ui/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── JobCard.tsx
│   │   ├── ResultView.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useGenerate.ts
│   │   ├── useJobPoll.ts
│   │   └── ...
│   ├── lib/                # API client and types
│   │   ├── api.ts
│   │   └── types.ts
│   ├── pages/              # Page components
│   │   ├── Landing.tsx
│   │   └── Dashboard.tsx
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   └── test/               # Test setup
├── public/                 # Static assets
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## API Integration

### Authentication

All API requests require a Clerk JWT token in the Authorization header:
```
Authorization: Bearer <clerk_token>
```

The token is automatically attached via the `useAuth` hook and API client.

### API Endpoints

#### POST `/api/v1/generate`

Request body:
```json
{
  "youtube_url": "https://www.youtube.com/watch?v=...",
  "transcript": "...", // optional if youtube_url provided
  "title_override": "...", // optional
  "tone": "professional" | "casual" | "humorous",
  "provider": "openrouter" | "openai",
  "model": "openai/gpt-4-turbo-preview"
}
```

Response:
```json
{
  "job_id": "uuid-string"
}
```

#### GET `/api/v1/jobs/{job_id}`

Response:
```json
{
  "job_id": "uuid-string",
  "status": "pending" | "processing" | "completed" | "failed",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp",
  "outputs": {
    "description": "Full video description...",
    "tags": ["tag1", "tag2", ...],
    "summary": ["Point 1", "Point 2", ...],
    "social_caption": "Social media caption...",
    "hashtags": ["hashtag1", "hashtag2", ...]
  },
  "error": "Error message if failed"
}
```

## Features in Detail

### Generate Flow

1. User pastes YouTube URL or uploads transcript
2. Optionally sets title override, tone, provider, and model
3. Clicks "Generate" button
4. Frontend calls POST `/api/v1/generate` with Clerk token
5. Receives `job_id` and starts polling GET `/api/v1/jobs/{job_id}`
6. Displays results when job completes

### Job Polling

- Polling starts immediately after job creation
- Uses exponential backoff (1s → 1.5s → ... → max 10s)
- Stops when job status is `completed` or `failed`
- Retries on errors with increased delay

### Result Display

Results are displayed in separate cards:
- **Description**: Full YouTube description with copy/download buttons
- **Tags**: Visual tag chips with comma-separated copy
- **Summary**: Bullet-point summary with copy
- **Social Caption**: Ready-to-post caption with hashtags

### Settings

Users can configure:
- Default provider (OpenRouter/OpenAI)
- Default model
- Web origin and callback URLs (for premium users)
- Preferences are saved to localStorage and optionally synced to backend

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (required) | - |
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_DEFAULT_PROVIDER` | Default AI provider | `openrouter` |
| `VITE_ALLOWED_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun test` - Run tests
- `bun test:ui` - Run tests with UI
- `bun lint` - Run ESLint
- `bun format` - Format code with Prettier

## Docker Deployment

Build the Docker image:
```bash
docker build -t postpilot-ui .
```

Run the container:
```bash
docker run -p 80:80 postpilot-ui
```

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Build command: `bun run build`
2. Publish directory: `dist`
3. Add environment variables in Netlify dashboard

## Development Checklist

Before running the app:

- [ ] Create Clerk app and set `VITE_CLERK_PUBLISHABLE_KEY`
- [ ] Set `VITE_API_URL` to your backend URL
- [ ] Start backend server (Docker Compose or local)
- [ ] Run `bun dev` to start frontend
- [ ] Test with sample YouTube links

## Testing

The project includes:
- Component tests for Header, Input, JobCard, ResultView
- API client tests with mocked fetch
- Auth redirect tests

Run all tests:
```bash
bun test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run `bun lint` and `bun test`
5. Submit a pull request

## License

MIT

