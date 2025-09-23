# BB84 Demo Backend

This folder contains a small FastAPI backend that simulates BB84-style key generation and provides simple XOR encrypt/decrypt endpoints for demo purposes.

Requirements
- Python 3.9+ (3.11 recommended)
- See `requirements.txt` for exact packages (FastAPI, qiskit, numpy)

Quick start (PowerShell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8001
```

Endpoints
- GET /generate_key?bits=256 -> returns JSON { key_bits, bases }
- POST /encrypt -> { message, key_bits } returns { cipher_hex }
- POST /decrypt -> { cipher_hex, key_bits } returns { message }

Example (PowerShell/curl)

```powershell
# generate a key
curl "http://localhost:8001/generate_key?bits=256"

# encrypt
curl -X POST "http://localhost:8001/encrypt" -H "Content-Type: application/json" -d '{"message":"hello","key_bits":"1010..."}'

# decrypt
curl -X POST "http://localhost:8001/decrypt" -H "Content-Type: application/json" -d '{"cipher_hex":"...","key_bits":"1010..."}'
```

Notes
- Qiskit is included in requirements so the module can simulate circuits. If Qiskit is unavailable or heavy for your environment the backend will fall back to a simple random-bit simulation.
- This backend is for demo/educational use only and not secure production crypto.
