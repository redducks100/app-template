const ITERATIONS = 100_000;
const ALGORITHM = "SHA-512";
const SALT_BYTES = 16;
const KEY_BYTES = 64;

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const normalized = password.normalize("NFKC");

  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(normalized),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: ALGORITHM },
    keyMaterial,
    KEY_BYTES * 8,
  );

  const saltHex = toHex(salt);
  const keyHex = toHex(new Uint8Array(derivedBits));

  return `pbkdf2:${ITERATIONS}:${saltHex}:${keyHex}`;
}

export async function verifyPassword(data: {
  password: string;
  hash: string;
}): Promise<boolean> {
  const { password, hash } = data;
  const parts = hash.split(":");
  if (parts[0] !== "pbkdf2" || parts.length !== 4) return false;

  const iterations = parseInt(parts[1], 10);
  const salt = fromHex(parts[2]);
  const expectedKey = fromHex(parts[3]);

  const encoder = new TextEncoder();
  const normalized = password.normalize("NFKC");

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(normalized),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt.buffer as ArrayBuffer, iterations, hash: ALGORITHM },
    keyMaterial,
    expectedKey.length * 8,
  );

  const derivedKey = new Uint8Array(derivedBits);

  // Constant-time comparison
  if (derivedKey.length !== expectedKey.length) return false;
  let diff = 0;
  for (let i = 0; i < derivedKey.length; i++) {
    diff |= derivedKey[i] ^ expectedKey[i];
  }
  return diff === 0;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
