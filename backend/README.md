# Voice Journal Backend MVP

This is the backend for the voice-based journaling application. It handles audio uploads, transcription via OpenAI Whisper, structured insight extraction using OpenAI Chat Completions, and data storage using SQLite and Prisma.

## Prerequisites

- Node.js (v18 or higher)
- OpenAI API Key

## Getting Started

### 1. Install Dependencies
Navigate to the `backend` directory and run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` folder (or edit the existing one) and add your OpenAI API Key:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
DATABASE_URL="file:./dev.db"
```

### 3. Setup Database
Run the following command to initialize the SQLite database and run migrations:
```bash
npx prisma migrate dev --name init
```

### 4. Run the Server
Start the development server:
```bash
npm run dev
```

The server will be running at `http://localhost:3001`.

## API Endpoints

### POST /journal
Creates a new journal entry. Requires `multipart/form-data`.
- `audioFile`: The voice recording file.
- `mood`: Integer (1-5).
- `sleepHours`: Float.
- `energy`: Integer (1-5).
- `gym`: Boolean string ("true" or "false").
- `reading`: Boolean string ("true" or "false").
- `prayer`: Boolean string ("true" or "false").
- `deepWork`: Boolean string ("true" or "false").

### GET /journal
Returns all journal entries sorted by date (newest first).

### GET /journal/:id
Returns a specific journal entry with its transcript and summary.

## Project Structure
- `/src/controllers`: Request handlers.
- `/src/services`: Business logic (AI transcription, AI summary, DB operations).
- `/src/routes`: API route definitions.
- `/src/utils`: Utilities like Multer configuration.
- `/prisma`: Database schema and migrations.
- `/uploads`: Storage for uploaded audio files.
