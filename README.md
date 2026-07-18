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
  Supabase 
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


## Install dependencies
bun install
# or
npm install
Run locally
bun dev
# or
npm run dev
Open http://localhost:8080 in your browser.

## Environment Variables
Create a .env file in the project root:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key



## Demo Notes
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
## License
This project is built for educational and portfolio purposes.


