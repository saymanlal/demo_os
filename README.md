```md
# AIOfficeOS — Full Setup & Execution Documentation

Demo OS is a full-stack, web-based operating-system style application built with a **Django ASGI backend**, **modern frontend**, and **ngrok-based public tunneling** for development and testing.

This document explains the **complete setup**, **multi-terminal execution**, and **why each command exists** — no assumptions, no missing steps.

---

## Table of Contents

1. Project Overview  
2. System Architecture  
3. Technology Stack  
4. Prerequisites  
5. Project Setup  
6. Running the Application (Multi-Terminal)  
7. Ngrok Configuration  
8. Frontend Execution  
9. Folder Structure  
10. Common Mistakes & Fixes  
11. Future Improvements  
12. Maintainer  

---

## 1. Project Overview

Demo OS simulates an **OS-like environment inside the browser**, powered by:

- Django ASGI backend (for HTTP + real-time capability)
- Frontend dev server (Node-based)
- Ngrok for public exposure of local backend

This is a **real system architecture**, not a UI-only demo.

---

## 2. System Architecture

```

Browser (User)
↓
Frontend Dev Server (npm)
↓ API Calls
Ngrok Public URL
↓
Django ASGI Backend (Daphne)

````

Key idea:
- Frontend talks ONLY to backend
- Ngrok exposes backend publicly
- Backend runs independently

---

## 3. Technology Stack

### Backend
- Python
- Django
- ASGI
- Daphne server

### Frontend
- Node.js
- npm
- Modern JS framework (React / Next)

### Tooling
- ngrok
- Git
- Linux shell

---

## 4. Prerequisites

Make sure these are installed:

```bash
python --version   # >= 3.9
node -v            # >= 16
npm -v             # >= 8
ngrok version
````

If ngrok is missing:

```bash
npm install -g ngrok
```

---

## 5. Project Setup

### Clone Repository

```bash
git clone https://github.com/saymanlal/demo_os.git
cd demo_os
```

---

### Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

(If virtualenv is used, activate it first.)

---

### Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 6. Running the Application (IMPORTANT)

⚠️ **This project requires THREE DIFFERENT TERMINALS.**
Running everything in one terminal will NOT work.

---

## Terminal 1 — Backend Server (Core)

```bash
cd demo_os/backend
daphne -b 0.0.0.0 -p 7000 backend.asgi:application
```

### What this does

* Starts Django backend on port **7000**
* Uses ASGI (required for WebSockets & async)
* `0.0.0.0` allows ngrok to access it

If this terminal stops → backend dies.

---

## Terminal 2 — Ngrok Tunnel (Public Access)

```bash
cd demo_os
ngrok http --request-header-add="ngrok-skip-browser-warning:true" 7000
```

### What this does

* Exposes `localhost:7000` to the internet
* Generates a public HTTPS URL
* Removes ngrok browser warning header

Example output:

```
Forwarding https://abc123.ngrok.io -> http://localhost:7000
```

📌 **This URL is what frontend will use as API base.**

---

## Terminal 3 — Frontend Dev Server

```bash
cd demo_os/frontend
npm run dev
```

### What this does

* Starts frontend development server
* Runs UI on local port (usually 3000)
* Connects to backend using ngrok URL

---

## 7. Frontend Environment Configuration

Create or update:

```bash
frontend/.env
```

```env
NEXT_PUBLIC_API_URL=https://abc123.ngrok.io
```

⚠️ Restart frontend after changing `.env`.

---

## 8. Why 3 Terminals Are REQUIRED

| Terminal         | Purpose          | Can it be merged? |
| ---------------- | ---------------- | ----------------- |
| Backend (Daphne) | Core API server  | ❌ No              |
| Ngrok            | Public tunneling | ❌ No              |
| Frontend (npm)   | UI dev server    | ❌ No              |

Each process is blocking and long-running.
Trying to run in one terminal = guaranteed failure.

---

## 9. Project Folder Structure

```
demo_os/
├── backend/
│   ├── backend/
│   │   └── asgi.py
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── package.json
│
├── backup/
└── README.md
```

---

## 10. Common Mistakes & Fixes

### Backend not accessible via ngrok

✔ Use `0.0.0.0`, not `127.0.0.1`

```bash
daphne -b 0.0.0.0 -p 7000 backend.asgi:application
```

---

### Frontend not hitting backend

✔ Check `.env`
✔ Restart frontend
✔ Confirm ngrok URL is active

---

### Port already in use

```bash
lsof -i :7000
kill -9 <PID>
```

---

## 11. Future Improvements

* Docker + docker-compose
* Authentication system
* Persistent database
* WebSocket-based live features
* Production ASGI server (Uvicorn + Nginx)

---

## 12. Maintainer

**Sayman Lal**
GitHub: [https://github.com/saymanlal](https://github.com/saymanlal)
Portfolio: [https://worksofsayman.vercel.app](https://worksofsayman.vercel.app)

For bugs or improvements, open a GitHub issue.

---