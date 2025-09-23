export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8001';

export async function healthCheck(timeout = 2000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${API_BASE}/generate_key?bits=8`, { signal: controller.signal });
    clearTimeout(id);
    return res.ok;
  } catch (err) {
    clearTimeout(id);
    return false;
  }
}

export async function generateKey(bits = 256) {
  try {
    const res = await fetch(`${API_BASE}/generate_key?bits=${bits}`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return res.json();
  } catch (err: any) {
    throw new Error(`generateKey failed: ${err?.message ?? err}`);
  }
}

export async function encrypt(message: string, key_bits: string) {
  try {
    const res = await fetch(`${API_BASE}/encrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, key_bits }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return res.json();
  } catch (err: any) {
    throw new Error(`encrypt failed: ${err?.message ?? err}`);
  }
}

export async function decrypt(cipher_hex: string, key_bits: string) {
  try {
    const res = await fetch(`${API_BASE}/decrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cipher_hex, key_bits }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return res.json();
  } catch (err: any) {
    throw new Error(`decrypt failed: ${err?.message ?? err}`);
  }
}
