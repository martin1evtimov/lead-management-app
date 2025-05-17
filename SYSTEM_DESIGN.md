# System Design

## Overview

This document outlines the system architecture and component interactions for the Lead Management System.

---

## High-Level Architecture

```ts
┌────────────────────────────────────┐
│         Public Lead Form           │
│        (Next.js + Tailwind)        │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│       Backend API (Next.js)        │
│   - Handles lead submission        │
│   - Saves file to /resume_files    │
│   - Stores in-memory array         │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│        Admin Dashboard (UI)        │
│   - Displays leads                 │
│   - Filter by status/search        │
│   - Update lead status (PATCH)     │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│        Redux Store (Client)        │
│   - Manages leads state            │
│   - Dispatches updates             │
└────────────────────────────────────┘
```
--- 

## Architecture

### Frontend

- **Framework**: Next.js (App Router)
- **UI Libraries**: Tailwind CSS, shadcn/ui
- **Form Handling**: JSONForms with schema-driven forms

### Backend

- **API Routes**:
  - `POST /api/leads`: Submits new leads and saves uploaded resumes
  - `GET /api/leads`: Returns all leads
  - `PATCH /api/leads`: Updates lead status
- **File Handling**: Resumes saved to `app/resume_files/` via Node `fs` module
- **Storage**: In-memory array (no database)

---

## Data Flow

1. User fills out and submits the lead form.
2. Form data and resume file are sent to `POST /api/leads`.
3. Server saves the resume to disk and adds the lead to memory.
4. Admin dashboard retrieves leads via `GET /api/leads`.
5. Admin updates status using `PATCH /api/leads`.

---

## Data Model

```ts
type Lead = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedin: string;
  visas: string[];
  additionalInfo: string;
  resumeName: string | null;
  resumeSize: number;
  status: "Pending" | "Reached Out";
  submitted: string;
};
