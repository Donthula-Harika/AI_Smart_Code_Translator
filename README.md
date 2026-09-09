# AI Smart Code Translator

An AI-powered full-stack code assistant that translates code, analyzes complexity, suggests optimizations, and explains code. It uses Google Gemini for AI responses, MongoDB for user data and history, and supports email/password and Google authentication.

## Features

- Translate between C, C++, C#, Java, and Python
- Analyze time and space complexity
- Generate optimized versions of code
- Explain code in plain language
- Save, view, and manage per-user activity history
- Authenticate with email/password or Google OAuth
- Edit code with the Monaco editor

## Tech stack

- Frontend: React 19, Vite, React Router, Monaco Editor
- Backend: Node.js, Express 5, Mongoose, JWT
- AI: Google Gemini API
- Database: MongoDB

## Prerequisites

- Node.js 18 or later
- A MongoDB database (local or Atlas)
- A Google Gemini API key
- A Google OAuth client ID (required for Google sign-in)

## Getting started

1. Clone the repository and open the project directory.

2. Install dependencies for both applications.

   ```bash
   cd server
   npm install

   cd ../client
   npm install
   ```

3. Create local environment files from the provided examples.

   ```bash
   cd ../server
   copy .env.example .env

   cd ../client
   copy .env.example .env
   ```

   On macOS or Linux, replace `copy` with `cp`.

4. Set the values in `server/.env`.

   ```env
   PORT=5000
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=a-long-random-secret
   JWT_EXPIRES_IN=7d
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   GEMINI_API_KEY=your-gemini-api-key
   ```

5. Set the values in `client/.env`.

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```

6. Start the backend in one terminal.

   ```bash
   cd server
   npm run dev
   ```

7. Start the frontend in another terminal.

   ```bash
   cd client
   npm run dev
   ```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## API overview

All endpoints are prefixed with `/api`. Routes marked as protected require a JWT bearer token.

| Area | Endpoint | Method | Access |
| --- | --- | --- | --- |
| Authentication | `/auth/register` | POST | Public |
| Authentication | `/auth/login` | POST | Public |
| Authentication | `/auth/google` | POST | Public |
| Authentication | `/auth/me` | GET | Protected |
| Authentication | `/auth/logout` | POST | Protected |
| Code tools | `/code/translate` | POST | Protected |
| Code tools | `/code/analyze` | POST | Protected |
| Code tools | `/code/optimize` | POST | Protected |
| Code tools | `/code/explain` | POST | Protected |
| History | `/history?page=1&limit=10` | GET | Protected |
| History | `/history/:id` | GET, DELETE | Protected |
| History | `/history/clear` | DELETE | Protected |

### Example: translate code

```http
POST /api/code/translate
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "print('Hello, world!')",
  "sourceLanguage": "python",
  "targetLanguage": "java"
}
```

## Available scripts

| Directory | Command | Description |
| --- | --- | --- |
| `server` | `npm start` | Start the backend server |
| `server` | `npm run dev` | Start the backend with file watching |
| `client` | `npm run dev` | Start the Vite development server |
| `client` | `npm run build` | Create a production client build |
| `client` | `npm run preview` | Preview the production client build |

## Project structure

```text
client/                 React frontend
  src/components/       Reusable interface components
  src/pages/            Login, workspace, and history pages
  src/services/         API client functions
server/                 Express backend
  src/controllers/      Request handlers
  src/routes/           API route definitions
  src/services/         Gemini, authentication, and history logic
  src/models/           MongoDB models
```

## Security notes

- Do not commit `.env` files or API keys.
- Use a strong, unique `JWT_SECRET` in each deployment environment.
- Configure `CLIENT_URL` and `VITE_API_URL` for your deployed frontend and backend URLs.
