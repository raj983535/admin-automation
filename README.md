# CollegeOS — Admin Foundation

A college automation SaaS **foundation prototype** for administrators. Built per Prompt 1: shared layout, theme system, and reusable UI components only — no feature modules yet.

## Stack

- React 19 + TypeScript
- Vite
- React Router
- CSS Modules + design tokens
- Lucide icons

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## What's included

### Layout
- App shell with collapsible sidebar
- Top navbar (search, notifications, profile)
- Page container with breadcrumb support

### Theme
- Warm enterprise palette (ivory, beige, muted brown, gold accents)
- Typography: DM Sans + Lora
- Workflow stage colors: blue, purple, orange, yellow, green, gray

### Reusable UI
- Cards (header, body, footer)
- Tables
- Modals
- Forms (fields, groups, inputs)
- Buttons
- Stage chips (workflow colors)
- Breadcrumb
- Notification toasts

### Pages (foundation demo only)
- **Dashboard** — mock stats + pipeline table preview
- **Design System** — component showcase

Sidebar module links (Admissions, Students, etc.) are disabled and marked "Soon".

## Next steps

Apply Prompt 2+ to add feature modules on top of this foundation.
