# E-MART – Ex 12: Full stack app (React + Node.js + Express + MongoDB)

```
emart-fullstack/
├── api/index.js        → Vercel serverless function (uses backend/app.js)
├── backend/app.js      → Express REST API (CRUD on EMartDB.Customers)
├── backend/server.js   → runs the API locally on port 5000
├── frontend/           → React (Vite) app
└── vercel.json
```

## Run on your laptop
1. Copy `.env.example` to `.env` and put your MongoDB Atlas connection string in `MONGO_URI`.
2. Terminal 1 (backend):
```bash
npm install
npm run server
```
3. Terminal 2 (frontend):
```bash
cd frontend
npm install
npm run dev
```
4. Open http://localhost:5173

## Deploy
1. Push to GitHub → import the repo in Vercel (keep the root folder as the project root).
2. Add environment variable `MONGO_URI` = your Atlas connection string.
3. Deploy. `vercel.json` builds the frontend and sends `/api/*` to the Express app.

In MongoDB Atlas → Network Access, allow `0.0.0.0/0` so Vercel can connect.
