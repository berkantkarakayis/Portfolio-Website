const encoder = new TextEncoder();

const toHex = (bytes) => [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

export const randomHex = (bytes = 32) => toHex(crypto.getRandomValues(new Uint8Array(bytes)));

export const sha256 = async (text) =>
  toHex(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(text))));

export const hmacSha256 = async (key, message) => {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return toHex(new Uint8Array(signature));
};

/** Reel i reads bytes [4i, 4i+4) of the digest and reduces them modulo the symbol count. */
export const outcomeFromDigest = (digestHex, reels, symbolCount) =>
  Array.from({ length: reels }, (_, i) => {
    const slice = digestHex.slice(i * 8, i * 8 + 8);
    return { slice, value: parseInt(slice, 16), symbol: parseInt(slice, 16) % symbolCount };
  });

/** A fresh server seed plus its public commitment (shown before the spin). */
export const createCommitment = async () => {
  const serverSeed = randomHex(32);
  return { serverSeed, commitment: await sha256(serverSeed) };
};

export const seedMessage = (clientSeed, nonce) => `${clientSeed}:${nonce}`;

/** Recomputes a finished spin from its revealed inputs. */
export const verifySpin = async ({ serverSeed, commitment, clientSeed, nonce, digest, reels, symbolCount }) => {
  const recomputedCommitment = await sha256(serverSeed);
  const recomputedDigest = await hmacSha256(serverSeed, seedMessage(clientSeed, nonce));
  const outcome = outcomeFromDigest(recomputedDigest, reels, symbolCount);
  return {
    commitmentOk: recomputedCommitment === commitment,
    digestOk: recomputedDigest === digest,
    recomputedCommitment,
    recomputedDigest,
    outcome,
  };
};
