# Secure Sprint Board

A minimalist, high-performance Kanban board built with Next.js 14, Supabase, and AI.

## Features
- **Magic Link Auth:** Seamless, passwordless login.
- **RLS (Row Level Security):** Data is secured at the database layer.
- **AI Sprint Planner:** Generate actionable tasks from descriptions using Groq (Llama 3.3).
- **Realtime Sync:** Live updates across all clients.
- **Multi-language:** Support for English and Polish (without reload).
- **Drag & Drop:** Fluid task management with `dnd-kit`.

## Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS, framer-motion.
- **Backend:** Supabase (Postgres, Auth, Realtime).
- **AI:** Groq SDK.
- **Testing:** Playwright E2E.
- **UI Workshop:** Storybook.

## Getting Started
1. Clone the repo.
2. Install dependencies: `pnpm install`.
3. Set up `.env.local` with Supabase and Groq keys.
4. Run locally: `pnpm dev`.

## Security Model
| Table | Policy | Logic |
|-------|--------|-------|
| `boards` | SELECT | User is a member of the board. |
| `tasks` | ALL | User is a member of the parent board. |

## AI Workflow
- Prompt -> Groq (Llama 3.3 70B) -> JSON Tasks -> Supabase Insert.
