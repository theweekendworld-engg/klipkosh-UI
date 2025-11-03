# PostPilot UI - Development Checklist

## Initial Setup

Before running the app for the first time:

- [ ] **Install Bun** (or Node.js 18+)
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

- [ ] **Install dependencies**
  ```bash
  bun install
  ```

- [ ] **Create Clerk application**
  1. Go to https://clerk.com
  2. Create a new application
  3. Copy the publishable key

- [ ] **Set up environment variables**
  ```bash
  cp .env.example .env
  # Edit .env with your keys
  ```

- [ ] **Configure environment variables in `.env`:**
  - `VITE_CLERK_PUBLISHABLE_KEY` - From Clerk dashboard
  - `VITE_API_URL` - Your backend URL (default: `http://localhost:8000`)
  - `VITE_DEFAULT_PROVIDER` - `openrouter` or `openai`
  - `VITE_ALLOWED_ORIGIN` - Your frontend URL (default: `http://localhost:3000`)

- [ ] **Start backend server**
  ```bash
  # If using docker-compose:
  docker-compose up
  
  # Or run backend locally
  ```

- [ ] **Start frontend development server**
  ```bash
  bun dev
  ```

## Testing the App

- [ ] **Test authentication flow**
  1. Visit `http://localhost:3000`
  2. Click "Get Started" or "Sign In"
  3. Complete Clerk sign-in
  4. Should redirect to `/dashboard`

- [ ] **Test YouTube URL input**
  1. Go to Dashboard
  2. Paste a YouTube URL (e.g., from the examples dropdown)
  3. Select tone and provider
  4. Click "Generate"
  5. Verify job is created and polling starts

- [ ] **Test transcript upload**
  1. Switch to "Transcript" input mode
  2. Either paste text or upload a `.txt` file
  3. Click "Generate"
  4. Verify job is created

- [ ] **Test result display**
  1. Wait for job to complete
  2. Verify all result cards are displayed:
     - Description card
     - Tags card
     - Summary card
     - Social Caption card
  3. Test copy buttons
  4. Test download button for description

- [ ] **Test settings**
  1. Click settings icon in header
  2. Change provider/model
  3. Save settings
  4. Verify settings persist (check localStorage)

- [ ] **Test keyboard shortcuts**
  1. Press `g` key (should focus input field)
  2. Test when input is not already focused

## Sample YouTube Links for Testing

Use these example URLs to test the app:

- Example 1: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Example 2: `https://www.youtube.com/watch?v=_uQrJ0TkZlc`

Or use your own YouTube videos.

## Troubleshooting

### Clerk Authentication Issues
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is set correctly
- Check Clerk dashboard for allowed callback URLs
- Ensure frontend URL matches Clerk configuration

### API Connection Issues
- Verify backend is running on `VITE_API_URL`
- Check CORS settings on backend
- Verify Clerk token is being sent in Authorization header
- Check browser console for errors

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && bun install`
- Clear Vite cache: `rm -rf dist .vite`
- Check TypeScript errors: `bun run build`

### Test Failures
- Run tests individually: `bun test Header.test.tsx`
- Check test setup file is correct
- Verify mocks are properly configured

## Production Deployment

Before deploying to production:

- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Update `VITE_CLERK_PUBLISHABLE_KEY` to production Clerk key
- [ ] Configure CORS on backend for production domain
- [ ] Update Clerk allowed origins/callbacks
- [ ] Run production build: `bun run build`
- [ ] Test production build locally: `bun run preview`
- [ ] Deploy `dist` folder to hosting service

## Commits Checklist

The project follows conventional commits:

- [ ] Use descriptive commit messages
- [ ] Small, focused commits
- [ ] All tests pass before committing
- [ ] Linter passes (`bun run lint`)
- [ ] Code is formatted (`bun run format`)

Example commit structure:
- `scaffold project`
- `integrate tailwind + shadcn`
- `implement auth with Clerk`
- `api client + hooks`
- `implement generate flow + job polling`
- `result card + copy/download`
- `tests + ci`

