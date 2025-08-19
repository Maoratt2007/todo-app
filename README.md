# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
AI-Assisted Todo App

A Todo app built with React + TypeScript + Vite and Supabase (Postgres + Auth).
Includes auth, per-user Row Level Security (RLS), full CRUD, filters, bulk actions, and loading/empty/error states.
This README follows the assignment’s submission checklist: setup, env vars, DB schema & RLS notes, architecture and AI usage summary.

installs:
1.install npm and nodejs LTS
2.pnpm create vite@latest todo-app -- --template react-ts 
3.cd todo-app
4.pnpm install
5.npm i @supabase/supabase-js  //supabase sdk(you get functions of supabse)
6.npm i react-router-dom     //for routers
7.pnpm run dev         //run the application

Environment Variables:
VITE_SUPABASE_URL=https://rhvgbpbaxxygsvkdufkv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodmdicGJheHh5Z3N2a2R1Zmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MDI4MjIsImV4cCI6MjA3MDQ3ODgyMn0.gKGPaMhZWA2WfkrdPwAkt3kgTsJTtSyerlzPhePUucY

Database Schema & RLS Notes:
-- We need the function gen_random_uuid for our table
create extension if not exists "pgcrypto";
-- Create the table "Todo" that represents tasks + relate it to auth.users (will help with RLS)
-- public is our schema (like a folder with tables inside)
create table public.todos(
  id uuid primary key default gen_random_uuid(), -- The row ID+default says if you didnt give any value to this field this is the default+cant be null or two row with the same value(primary key)
  user_id uuid not null references auth.users, -- Supabase provides the auth.users table that manages users; this ensures each task has a user that exists in auth.users
  title text not null check(char_length(title)<=200), -- The title is required (per requirements) + the char_length check supports Unicode (emojis and Hebrew, for example)
  description text,
  due_date date,
  priority text check (priority in ('low','med','high')) default 'low',
  completed boolean default false,
  created_at timestamptz default now() -- timestamptz is a timestamp with time zone (stored in UTC, displayed in your local time)
);
-- INDEX
-- Helps fetch a user's tasks efficiently: O(log n+k)(k its the neighbors that beside him their value in userid the same) index lookups instead of an O(n) full table scan
create index todos_user_id_idx
on public.todos(user_id);
-- RLS
alter table public.todos enable row level security;-- After this line, the table uses RLS and policies. Without policies, no rows are accessible
-- read — only the signed-in user can read their own tasks (requirement: "Ensure users only see their own data")
create policy "read own todos"
on public.todos
for select 
to authenticated 
using(user_id=auth.uid()); -- auth.uid() returns the ID of the user making the request; only rows where user_id = auth.uid() will be selected
-- Let's do it for Create, Update, and Delete — it's important
-- Create 
create policy "insert own todos"
on public.todos
for insert
to authenticated
with check (user_id = auth.uid()); -- Only you can insert your own tasks; no one else
-- Update 
create policy "update own todos"
on public.todos
for update
to authenticated
using (user_id = auth.uid()) -- You can update only your own rows
with check (user_id = auth.uid());-- Only you can modify these rows; no one else
-- Delete --
create policy "delete own todos"
on public.todos
for delete
to authenticated
using (user_id = auth.uid());

Architecture overview
src/
  lib/supabase.ts      
  components/
    AuthPage.tsx       
    LoadingPage.tsx     
    TodoPage.tsx        
  App.tsx              
  main.tsx              

AI usage summary
During the project, I used ChatGPT/Cursor to understand general ideas, break the work into stages, and get direction on what I was going to do.
It helped me connect Supabase to the project and connect Git to the project.
They helped me understand concepts like components, state, and more...






