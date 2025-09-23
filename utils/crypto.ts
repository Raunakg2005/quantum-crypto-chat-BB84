/**
 * Frontend BB84 simulation for demo purposes.
 * - generate random sender bits & bases
 * - generate random receiver bases and compare to derive shared key bits
 * - derive a byte key (repeating shared key bits) and XOR-encrypt the message
 * NOTE: purely educational and NOT secure.
 */

type BB84Result = {
  cipher: string; // hex
  keyBits: string; // string of '0'/'1' bits that are the shared key
  keyBytesHex: string; // byte-represented key used for XOR
  decrypted?: string; // for demo: decrypted plain text (receiver would decrypt)
};

export function bb84Encode(plain: string): BB84Result {
  const plainBytes = Array.from(new TextEncoder().encode(plain));

  // 1) Sender generates random bits and bases
  const senderBits = randomBits(plainBytes.length * 8);
  const senderBases = randomBits(plainBytes.length * 8); // 0 = rectilinear, 1 = diagonal

  // 2) Receiver chooses random bases
  const receiverBases = randomBits(plainBytes.length * 8);

  // 3) Compare bases — positions where equal become shared key bits
  const keyBitsArr: string[] = [];
  for (let i = 0; i < senderBases.length; i++) {
    if (senderBases[i] === receiverBases[i]) {
      keyBitsArr.push(String(senderBits[i]));
    }
  }
  const keyBits = keyBitsArr.join('');

  // 4) Build a byte key from the key bits, repeating/truncating to plaintext length
  const keyBytes = keyBitsToBytes(keyBits, plainBytes.length);

  // 5) XOR-encrypt
  const cipherBytes = plainBytes.map((b, i) => b ^ keyBytes[i]);

  return {
    cipher: bytesToHex(cipherBytes),
    keyBits,
    keyBytesHex: bytesToHex(keyBytes),
    decrypted: plain, // demo helper: reveal original so UI can toggle
  };
}

export function bb84Decode(cipherHex: string, keyBits: string) {
  const cipherBytes = hexToBytes(cipherHex);
  const keyBytes = keyBitsToBytes(keyBits, cipherBytes.length);
  const plainBytes = cipherBytes.map((b, i) => b ^ keyBytes[i]);
  const decrypted = new TextDecoder().decode(new Uint8Array(plainBytes));
  return { decrypted };
}

function randomBits(n: number) {
  const bits: number[] = [];
  for (let i = 0; i < n; i++) bits.push(Math.random() > 0.5 ? 1 : 0);
  return bits;
}

function keyBitsToBytes(bits: string, outLen: number) {
  // repeat bits as needed to build outLen bytes
  if (bits.length === 0) return new Array(outLen).fill(0);
  const bytes: number[] = [];
  for (let b = 0; b < outLen; b++) {
    let byte = 0;
    for (let bit = 0; bit < 8; bit++) {
      const idx = (b * 8 + bit) % bits.length;
      const bitVal = bits.charCodeAt(idx) - 48; // '0'/'1'
      byte = (byte << 1) | (bitVal & 1);
    }
    bytes.push(byte);
  }
  return bytes;
}

function bytesToHex(bytes: number[]) {
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string) {
  if (!hex) return [];
  const out: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    out.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return out;
}
