# ⚡ EchoPulse – In-Browser API Workbench & Telemetry Engine

> A high-performance, developer-focused API testing workbench and telemetry engine built with **Next.js 16, TypeScript, Zustand, and Tailwind CSS**. Serves as a modern, lightweight, browser-first alternative to Postman and Insomnia.

---

## 🌟 Key Highlights for Recruiters & Hiring Managers

- **Client-Side HTTP Telemetry:** Real-time round-trip latency (`timeMs`), exact wire payload size (`sizeBytes`), HTTP status codes, and complete response headers tree inspection.
- **Serverless CORS Proxy Pipeline:** Native Next.js App Router edge route (`/api/proxy`) that eliminates browser CORS blocking while benchmarking endpoint latency.
- **Multi-Language Code Generation Engine:** 1-Click dynamic export into production-ready snippets across:
  - `cURL` CLI
  - JavaScript `fetch()`
  - JavaScript / TypeScript `axios`
  - Python `requests`
- **Dynamic Environment Variables:** Templating engine supporting `{{variableName}}` injection across URLs, headers, and request bodies with live resolution.
- **Client State & History Machine:** Scalable, reactive client-side state powered by **Zustand**, persisting request execution logs and status badges.
- **Quick Demo Suite:** Built-in 1-click test configurations (GET Users, POST Create, GET Products) for rapid verification.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router, Server Route Handlers)
- **Language:** TypeScript 5 (Strict type checking, zero `any` leaks)
- **State Management:** Zustand (Immutable decoupled state)
- **Styling:** Tailwind CSS (Modern dark-mode glassmorphic theme)
- **Icons:** Lucide React
- **Telemetry & Networking:** Web Streams API, Fetch API, Blob Size Computations

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 📸 Resume Bullet Points (Copy & Paste)

```markdown
**EchoPulse – In-Browser API Workbench & Telemetry Engine** | *Next.js 16, TypeScript, Zustand, Tailwind CSS*
- Engineered a high-performance browser-based API client (Postman alternative) measuring round-trip latency, payload sizes, and header trees with instant zero-reload feedback.
- Architected a Next.js App Router proxy pipeline to eliminate CORS restrictions while collecting granular client-side network telemetry.
- Designed an automated Code Export Engine generating plug-and-play client code snippets across cURL, Fetch API, Axios, and Python requests.
- Integrated a dynamic environment templating system ({{baseUrl}}) and reactive history stack using Zustand.
```
