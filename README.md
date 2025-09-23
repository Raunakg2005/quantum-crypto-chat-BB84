# Quantum Cryptography Demo App

This repository contains a small demo showing BB84 quantum key distribution (simulated) and a chat-like UI that uses the derived key to XOR-encrypt messages.

## Whats inside
- `app/` - Next.js frontend (app router). Serves the chat UI.
- `components/` - React components used by the frontend.
- `backend/` - FastAPI backend that simulates BB84 and exposes `/generate_key`, `/encrypt`, `/decrypt`.

## Quick start (recommended)

Prerequisites:
- Node.js (16+ recommended)
- Python 3.11+ (or your system Python)

1) Start the backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pytest -q   # optional tests
uvicorn main:app --reload --port 8001
```

If Qiskit installation is slow or fails, the backend includes a numpy-based fallback so the demo still works.

2) Start the frontend

```powershell
cd ..
npm install
npm run dev
```

Open http://localhost:3000 and use the chat UI. The frontend pings the backend; if unreachable a small red banner will appear.

## Environment
- `NEXT_PUBLIC_API_BASE` - optional override for backend base URL (defaults to `http://localhost:8001`).

## Notes
- The encryption used is XOR for demonstration only — not secure for real use. For a stronger educational demo, consider replacing XOR with AES using the derived key as a seed/key material (not covered by this demo).
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
