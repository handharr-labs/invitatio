import { randomBytes } from "@handharr-labs/forge-core";

const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"; // no look-alikes (0/o/1/l)

/**
 * A short, URL-safe, hard-to-guess token for a personalized guest link
 * (10 chars ≈ 50 bits). Global uniqueness is enforced by the DB unique
 * constraint; on the astronomically-rare collision the insert simply retries.
 */
export function generateGuestToken(length = 10): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}
