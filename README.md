# Internote

An Ionic + Angular 17 app for tracking internship applications. (video: internote-demo.mp4)

## Tech Stack

- Ionic + Angular 17
- Supabase (Backend)

## Setup

### 1. Install dependencies
```bash
git clone <your-repo-url>
cd internote
npm install
```

### 2. Configure Supabase

Create a Supabase project and add your credentials to `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  supabaseUrl: '<YOUR_SUPABASE_URL>',
  supabaseKey: '<YOUR_SUPABASE_KEY>',
};
```

### 3. Create database table

Run this in your Supabase SQL editor:
```sql
create table internships (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp default now(),
  updated_at timestamp default now(),
  company_name text not null,
  industry text not null,
  company_size text not null,
  position text not null,
  tech_stack text not null,
  country text not null,
  city text not null,
  work_mode text not null,
  application_date date not null,
  application_method text not null,
  application_reference text not null,
  status text not null,
  resume_version text,
  resume_url text,
  motivation_version text,
  motivation_url text,
  notes text
);

alter table internships disable row level security;
```

### 4. Run the app
```bash
ionic serve
```

App opens at `http://localhost:8100`

### 5. Build for production
```bash
ionic build --prod
```

## What it does

Track internship applications with details like company info, position, application status, tech stack, location, work mode, and attached documents (resume/motivation letters).
