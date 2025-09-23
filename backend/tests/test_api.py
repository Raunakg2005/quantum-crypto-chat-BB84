import sys
import os
from fastapi.testclient import TestClient

# ensure the project root (parent of 'backend') is on sys.path so 'backend' package is importable
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.main import app

client = TestClient(app)


def test_generate_key():
    r = client.get('/generate_key?bits=64')
    assert r.status_code == 200
    data = r.json()
    assert 'shared_key' in data
    assert 'sender_bits' in data
    assert 'sender_bases' in data
    assert len(data['shared_key']) > 0


def test_encrypt_decrypt_roundtrip():
    # generate key
    r = client.get('/generate_key?bits=128')
    assert r.status_code == 200
    key_bits = r.json()['shared_key']

    msg = 'hello smoke test'
    r2 = client.post('/encrypt', json={'message': msg, 'key_bits': key_bits})
    assert r2.status_code == 200
    cipher = r2.json()['cipher_hex']

    r3 = client.post('/decrypt', json={'cipher_hex': cipher, 'key_bits': key_bits})
    assert r3.status_code == 200
    assert r3.json()['message'] == msg
