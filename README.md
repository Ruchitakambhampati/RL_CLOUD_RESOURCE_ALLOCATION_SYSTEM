# RL Autoscaling Demo - Full Project Guide

This repository contains a 3-layer autoscaling demo:

- `rl-fastapi` - Python FastAPI RL engine (decision, training, reset)
- `backend-node` - Node/Express gateway API
- `frontend-react` - React dashboard UI

## Architecture

- Frontend calls Vite proxy paths:
  - `/node-api/*` -> `http://localhost:3000/*`
  - `/py-api/*` -> `http://localhost:5000/*`
- Node gateway forwards selected requests to FastAPI.
- FastAPI runs Q-learning and persists the Q-table in `rl-fastapi/qtable.json`.

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm
- Python 3.10+
- pip

## Project Structure

- `rl-fastapi/main.py` - FastAPI routes
- `rl-fastapi/agent.py` - Q-learning logic
- `rl-fastapi/environment.py` - environment transition/reward logic
- `backend-node/server.js` - Express server entry
- `backend-node/routes/api.js` - Node API routes
- `backend-node/services/pythonService.js` - FastAPI call bridge
- `frontend-react/src` - UI components and services

## Setup

### 1) FastAPI service (port 5000)

```bash
cd rl-fastapi
pip install fastapi uvicorn
python -m uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

Health check:

```bash
http://localhost:5000/health
```

### 2) Node gateway (port 3000)

```bash
cd backend-node
npm install
node server.js
```

### 3) React frontend (port 5173)

```bash
cd frontend-react
npm install
npm run dev
```

For Windows PowerShell policy issues, use:

```bash
npm.cmd install
npm.cmd run dev
```

## Run Order

Start in this order to avoid proxy errors:

1. FastAPI (`5000`)
2. Node gateway (`3000`)
3. React frontend (`5173`)

## Available APIs

### FastAPI (`http://localhost:5000`)

- `GET /health` - service status
- `POST /decide` - get scaling action from state
- `POST /train` - run training episodes
- `POST /reset` - clear learned Q-table in memory

Sample `POST /decide` body:

```json
{
  "cpu": 50,
  "memory": 40,
  "instances": 2,
  "request_rate": 100
}
```

### Node gateway (`http://localhost:3000`)

- `POST /api/decide` - proxy to FastAPI `/decide`
- `POST /api/train` - proxy to FastAPI `/train`

## Frontend Notes

- UI is split into 3 sections: Decide, Train, Reset.
- Endpoint logic is in `frontend-react/src/services/apiClient.js`.
- Vite proxy is configured in `frontend-react/vite.config.js`.

## Troubleshooting

### `http proxy error` / `ECONNREFUSED`

One or more backend services are not running. Confirm:

- FastAPI is up on `http://localhost:5000/health`
- Node is up on `http://localhost:3000`

### PowerShell `running scripts is disabled`

Use `npm.cmd` instead of `npm`:

```bash
npm.cmd install
npm.cmd run dev
```

### Q-table reset behavior

- `POST /reset` clears in-memory table.
- `qtable.json` is updated during learning updates in `agent.py`.

## Optional Improvements

- Add `start` scripts in `backend-node/package.json`
- Add Python `requirements.txt` in `rl-fastapi`
- Add Docker Compose for one-command startup
