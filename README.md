# PrepPilot AI

**AI-driven interview preparation platform** that analyzes your resume, conducts voice-based mock interviews (Technical or HR/Behavioral), and delivers personalized feedback with scoring.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Edge Function](#edge-function)
- [Scoring Model](#scoring-model)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Examiner / Demo Notes](#examiner--demo-notes)
- [Roadmap](#roadmap)

---

## Overview

PrepPilot AI helps job seekers practice interviews by:

1. **Uploading a resume** (PDF or text) at the start.
2. **AI analyzes the resume** to extract skills, experience, and domain focus.
3. **Choosing an interview type**: Technical Round or HR/Behavioral Round.
4. **Answering questions via microphone** using browser Speech Recognition.
5. **Receiving per-question scores, round scores, and overall scores** plus personalized feedback on grammar, accuracy, clarity, and confidence.
6. **Getting a tailored learning plan** and interview do's & don'ts.

---

## Features

- 📄 **Resume Analysis** — Extracts text from PDFs and uses Gemini AI to analyze skills, experience, and role fit.
- 🎤 **Voice-Based Q&A** — Browser SpeechRecognition API converts spoken answers to text.
- 🤖 **AI-Generated Questions** — Technical or HR questions personalized based on the resume.
- 📊 **Multi-Dimensional Scoring** — Grammar, accuracy, relevance, clarity, confidence, and technical depth.
- 🧠 **Personalized Feedback & Learning Plan** — Actionable suggestions and a study roadmap.
- 🔐 **Authentication** — Supabase Auth with email/password login and persistent user profiles.
- 🌙 **Modern UI** — Deep navy + amber theme with glassmorphism and smooth animations.

---

## Tech Stack

|
 Layer 
|
 Technology 
|
|
-------
|
------------
|
|
 Frontend 
|
 React 18, TypeScript, Vite, Tailwind CSS 
|
|
 UI Components 
|
 shadcn/ui 
|
|
 State Management 
|
 React Context API 
|
|
 Backend / Auth 
|
 Lovable Cloud / Supabase 
|
|
 Edge Functions 
|
 Deno + Gemini API 
|
|
 Resume Parsing 
|
 pdfjs-dist 
|
|
 Voice Input 
|
 Web Speech API 
|
|
 Styling 
|
 Tailwind CSS v3, custom CSS variables 
|

---

## Project Structure

```text
preppilot-ai/
├── public/
│   └── favicon.png
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── InterviewTips.tsx
│   │   ├── ResumeUpload.tsx
│   │   ├── InterviewSession.tsx
│   │   └── ResultsDashboard.tsx
│   ├── contexts/
│   │   └── InterviewContext.tsx
│   ├── lib/
│   │   ├── pdfParser.ts
│   │   └── utils.ts
│   ├── pages/
│   │   └── Index.tsx
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── functions/
│       └── interview-ai/
│           └── index.ts
├── index.html
├── tailwind.config.ts
├── tsconfig.json
└── README.md
Getting Started
Prerequisites
Node.js 18+
npm or bun
Install dependencies
bun install
# or
npm install
Run locally
bun dev
# or
npm run dev
Open http://localhost:8080 in your browser.

Environment Variables
Create a .env file in the project root:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Note: The Supabase service role key and database password are managed by Lovable Cloud and are not exposed to the client.

Database Schema
profiles
Stores user profile information linked to Supabase Auth.

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text,
    avatar_url text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
interviews
Stores interview sessions and results.

create table public.interviews (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    resume_text text,
    interview_type text,
    questions jsonb,
    answers jsonb,
    scores jsonb,
    overall_score numeric,
    feedback text,
    learning_plan text,
    created_at timestamp with time zone default now()
);

alter table public.interviews enable row level security;

create policy "Users can read own interviews"
on public.interviews for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own interviews"
on public.interviews for insert
to authenticated
with check (auth.uid() = user_id);
Edge Function
supabase/functions/interview-ai/index.ts

Handles three operations:

analyze_resume — Parses resume and returns skills, experience summary, and domain.
generate_questions — Returns technical or HR questions tailored to the resume.
score_answer — Evaluates a spoken answer and returns scores + feedback.
Built with Deno and the Gemini API.

Scoring Model
Each answer is scored from 0–100 across:

Dimension	Weight	Description
Accuracy	25%	Correctness of the answer
Relevance	20%	How well it addresses the question
Clarity	20%	Structure and articulation
Grammar	15%	Language correctness
Confidence	10%	Tone and certainty
Technical Depth	10%	Depth of technical knowledge
Round score = average of question scores. Overall score = weighted average of round scores.

Authentication
Supabase Auth with email/password.
Google OAuth can be enabled in the backend.
User profiles stored in public.profiles.
Row Level Security ensures users only access their own data.
Deployment
The app is deployed via Lovable. Published URL:

https://interview-buddy-ai-36.lovable.app
To deploy manually, build the frontend and host the static files:

bun run build
# or
npm run build
Examiner / Demo Notes
To demonstrate this project is original work:

GitHub Repository — Show commit history and code authorship.
Database Access — Connect to the Supabase database using pgAdmin or DBeaver with the connection string.
Local Development — Run the project locally and walk through the code in VS Code.
Edge Function Code — Review supabase/functions/interview-ai/index.ts for server-side logic.
Migrations — SQL schema files show table definitions, RLS policies, and GRANT statements.
Roadmap
 Add more interview types (System Design, Behavioral STAR)
 Store full interview history with progress tracking
 Add AI-generated follow-up questions
 Support multi-language interviews
 Add video recording for body language feedback
License
This project is built for educational and portfolio purposes.

Built with React, TypeScript
