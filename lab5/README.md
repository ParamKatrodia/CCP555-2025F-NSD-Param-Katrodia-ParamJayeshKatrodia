<<<<<<< HEAD
# fragments
Fragments back-end API
📌 Overview

This project is a Node.js + Express microservice for the course lab.
It is fully configured with:
Prettier (code formatting)
ESLint (linting)
Pino (structured logging)
Express server with security, CORS, and compression
NPM scripts for development and debugging
VS Code debugger integration

⚙️ Requirements
Node.js (LTS version, v20+ recommended)
Git
VS Code with extensions:
Prettier – Code Formatter
ESLint
Code Spell Checker
Git Bash / WSL2 (for Windows users)
jq (for pretty-printing JSON in terminal)

NPM Scripts

Lint code (npm run lint)

Start server normally (npm start)

Start in dev mode (auto-restarts + debug logs) (npm run dev)

Start in debug mode (attach VS Code debugger) (npm run debug)

🌐 API Endpoint
GET /

Health check route — returns JSON with project info.
Example response:

{
  "status": "ok",
  "author": "Param Katrodia",
  "githubUrl": "https://github.com/ParamKatrodia/fragments",
  "version": "0.0.1"
}

🛠 Debugging with VS Code

Start debug script:

npm run debug


In VS Code, open Run and Debug panel → select Debug via npm run debug.

Set a breakpoint in src/app.js:

res.status(200).json({


Trigger endpoint:

curl -s http://localhost:8080


VS Code will pause at the breakpoint (yellow arrow).
=======
# CCP555-2025F-NSD-Param-Katrodia-ParamJayeshKatrodia

This repository contains all labs for CCP555 (Fall 2025, NSD section).  
Each lab is organized in its own folder:

- **lab1/** → Backend microservice (`fragments`)
- **lab2/** → Frontend UI (`fragments-ui`)

## How to Run Labs

### Lab 1 (Backend - fragments)
```bash
Code for Lab 1 is inside `lab1/fragments`.
cd lab1/fragments
npm install
npm run dev

**### Lab 2 (Frontend - fragments-ui)**
Code for Lab 2 is inside `lab2/fragments-ui`.
cd lab2/fragments-ui
npm install
npm run dev
>>>>>>> fa6b14c6417482413a818df1ec89525072001d86
