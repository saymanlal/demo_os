# AIOfficeOS
### Full-System Technical Documentation

AIOfficeOS is a full-stack, web-based operating-system–style platform that simulates a desktop-like environment inside the browser.  
The system is architected using a **Django ASGI backend**, a **modern Node-based frontend**, and **ngrok-powered tunneling** for development-time public access.

This document is the **single source of truth** for understanding, running, and extending the system.

---

## Documentation Index

- [1. System Overview](#1-system-overview)
- [2. Architectural Design](#2-architectural-design)
- [3. Technology Stack](#3-technology-stack)
- [4. Development Environment Requirements](#4-development-environment-requirements)
- [5. Repository Structure](#5-repository-structure)
- [6. Installation & Dependency Setup](#6-installation--dependency-setup)
- [7. Runtime Execution Model](#7-runtime-execution-model)
- [8. Multi-Terminal Workflow (Critical)](#8-multi-terminal-workflow-critical)
- [9. Backend Server Configuration](#9-backend-server-configuration)
- [10. Ngrok Tunneling Strategy](#10-ngrok-tunneling-strategy)
- [11. Frontend Configuration & Execution](#11-frontend-configuration--execution)
- [12. Environment Variable Management](#12-environment-variable-management)
- [13. Operational Constraints & Design Decisions](#13-operational-constraints--design-decisions)
- [14. Troubleshooting & Diagnostics](#14-troubleshooting--diagnostics)
- [15. System Roadmap](#15-system-roadmap)
- [16. Maintainers](#16-maintainers)

---

## 1. System Overview

AIOfficeOS emulates an operating-system-like workflow inside a web browser.  
Rather than focusing on UI alone, the project demonstrates **process isolation**, **API-driven coordination**, and **asynchronous backend execution**.

Core characteristics:

- Distributed local runtime
- Independent long-running processes
- ASGI-first backend design
- Explicit separation of concerns

This is an engineering system, not a mock UI.

---

## 2. Architectural Design

### High-Level Request Flow

```

Browser (User)
↓
Frontend Dev Server (Node.js)
↓ HTTPS API Requests
Ngrok Secure Tunnel
↓
Django ASGI Backend (Daphne)

````

### Design Principles

- Frontend never directly accesses localhost backend
- Backend remains frontend-agnostic
- Ngrok is the single ingress point during development
- Each layer can fail or restart independently without cascading crashes

---

## 3. Technology Stack

### Backend
- Python 3.9+
- Django
- ASGI interface
- Daphne server

### Frontend
- Node.js 16+
- npm
- React / Next.js–based architecture

### Tooling & Infra
- ngrok (secure tunneling)
- Git & GitHub
- Linux shell environment

---

## 4. Development Environment Requirements

Verify required tools:

```bash
python --version   # >= 3.9
node -v            # >= 16
npm -v             # >= 8
ngrok version
````

Install ngrok if missing:

```bash
npm install -g ngrok
```

---

## 5. Repository Structure

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

### Responsibility Boundaries

* `backend/` → API layer, async execution, system logic
* `frontend/` → UI, OS simulation, client-side state
* `backup/` → non-production artifacts

---

## 6. Installation & Dependency Setup

### Clone Repository

```bash
git clone https://github.com/saymanlal/demo_os.git
cd demo_os
```

### Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 7. Runtime Execution Model

AIOfficeOS runs as **three independent long-lived processes**:

1. ASGI backend server
2. Ngrok tunnel
3. Frontend dev server

Each process is blocking and must remain active.

---

## 8. Multi-Terminal Workflow (Critical)

⚠️ **This system REQUIRES three separate terminals.**
Combining processes will break execution.

---

### Terminal 1 — Backend (ASGI Core)

```bash
cd demo_os/backend
daphne -b 0.0.0.0 -p 7000 backend.asgi:application
```

Purpose:

* Starts Django ASGI server
* Enables async & WebSocket support
* Binds externally for ngrok access

---

### Terminal 2 — Ngrok Tunnel

```bash
cd demo_os
ngrok http --request-header-add="ngrok-skip-browser-warning:true" 7000
```

Purpose:

* Exposes backend publicly
* Generates HTTPS endpoint
* Eliminates ngrok warning headers

Example:

```
https://abc123.ngrok.io → http://localhost:7000
```

---

### Terminal 3 — Frontend Dev Server

```bash
cd demo_os/frontend
npm run dev
```

Purpose:

* Serves UI
* Connects to backend through ngrok URL
* Enables hot reload

---

## 9. Backend Server Configuration

Key requirements:

* Must bind to `0.0.0.0`
* Must use ASGI server (not runserver)
* Must remain running before frontend starts

Incorrect binding will break ngrok access.

---

## 10. Ngrok Tunneling Strategy

Ngrok is used **only in development** to:

* Simulate production-like HTTPS
* Allow cross-origin frontend access
* Enable testing on remote devices

Ngrok URL must be treated as ephemeral.

---

## 11. Frontend Configuration & Execution

Create or update environment file:

```bash
frontend/.env
```

```env
NEXT_PUBLIC_API_URL=https://abc123.ngrok.io
```

⚠️ Frontend must be restarted after changes.

---

## 12. Environment Variable Management

Rules:

* Frontend variables must be prefixed with `NEXT_PUBLIC_`
* Backend secrets must never be committed
* Ngrok URLs must be updated on restart

---

## 13. Operational Constraints & Design Decisions

* ASGI chosen over WSGI for future real-time features
* Ngrok preferred over port forwarding for security
* Multi-terminal workflow ensures process isolation
* No implicit dependencies between layers

---

## 14. Troubleshooting & Diagnostics

### Backend not reachable

* Confirm `0.0.0.0` binding
* Ensure ngrok tunnel is active

### Frontend API errors

* Verify `.env` value
* Restart frontend
* Check ngrok URL validity

### Port conflict

```bash
lsof -i :7000
kill -9 <PID>
```

---

## 15. System Roadmap

* Docker & docker-compose
* Authentication & user sessions
* Persistent storage
* WebSocket-based live services
* Production ASGI stack (Uvicorn + Nginx)

---

## 16. Maintainers

**Sayman Lal**
GitHub: [https://github.com/saymanlal](https://github.com/saymanlal)
Portfolio: [https://worksofsayman.vercel.app](https://worksofsayman.vercel.app)

**Utkarsh Kushwaha**
GitHub: [https://github.com/utkarshwrks](https://github.com/utkarshwrks)
Portfolio: [https://utkarsh-kushwaha.vercel.app](https://utkarsh-kushwaha.vercel.app)

**Yash Namdeo**
GitHub: [https://github.com/yashwrks](https://github.com/yashwrks)
LinkedIn: [https://linkedin.com/yashwrks](https://linkedin.com/yashwrks)

For bugs or improvements, open a GitHub issue.