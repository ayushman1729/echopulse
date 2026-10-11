# ⚡ EchoPulse – In-Browser API Workbench & Telemetry Engine

A browser-based API testing workbench built with **Next.js, TypeScript, Zustand and Tailwind CSS**. A lightweight, browser-first alternative to Postman and Insomnia.

**🔗 Live Demo:** [echopulse-nine.vercel.app](https://echopulse-nine.vercel.app)

![EchoPulse screenshot](./public/screenshot.png)

---

## ✨ Features

- **HTTP Telemetry:** Round-trip latency, response payload size, status codes and a full response headers view.
- **CORS Proxy:** A Next.js App Router route handler (`/api/proxy`) that avoids browser CORS blocking while measuring endpoint response time.
- **Code Export:** One-click export of a request as a `cURL`, `fetch()`, `axios` or Python `requests` snippet.
- **Environment Variables:** `{{variableName}}` templating across URLs, headers and request bodies.
- **Request History:** Reactive execution history built with Zustand.
- **Quick Demos:** One-click sample requests (GET Users, POST Create, GET Products).

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Route Handlers)
- **Language:** TypeScript (strict mode)
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For a production build:

```bash
npm run build
npm run start
```
