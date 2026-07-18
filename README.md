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

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI Components | shadcn/ui |
| State Management | React Context API |
| Backend / Auth | Lovable Cloud / Supabase |
| Edge Functions | Deno + Gemini API |
| Resume Parsing

