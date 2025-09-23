from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Any
import os

from bb84 import generate_bb84_key, xor_encrypt, xor_decrypt

app = FastAPI(title="BB84 Demo Backend")

allow_origins_env = os.getenv('ALLOW_ORIGINS')
if allow_origins_env:
    allow_origins = [o.strip() for o in allow_origins_env.split(',') if o.strip()]
else:
    allow_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EncryptRequest(BaseModel):
    message: str
    key_bits: str


class EncryptResponse(BaseModel):
    cipher_hex: str


class DecryptRequest(BaseModel):
    cipher_hex: str
    key_bits: str


class DecryptResponse(BaseModel):
    message: str


@app.get("/generate_key")
def generate_key(bits: int = 256, with_eve: bool = False) -> Any:
    # returns a dict with sender_bits, sender_bases, receiver_bases, kept_positions, shared_key
    res = generate_bb84_key(bits, with_eve=with_eve)
    return res


@app.post("/encrypt", response_model=EncryptResponse)
def encrypt(req: EncryptRequest):
    plain_bytes = req.message.encode('utf-8')
    cipher = xor_encrypt(plain_bytes, req.key_bits)
    return EncryptResponse(cipher_hex=cipher.hex())


@app.post("/decrypt", response_model=DecryptResponse)
def decrypt(req: DecryptRequest):
    cipher = bytes.fromhex(req.cipher_hex)
    plain = xor_decrypt(cipher, req.key_bits)
    return DecryptResponse(message=plain.decode('utf-8', errors='replace'))


@app.get("/healthz")
def healthz():
    """Lightweight health-check used by load balancers and hosts like Render."""
    return {"status": "ok"}
