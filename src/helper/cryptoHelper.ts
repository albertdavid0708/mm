// encryptionUtils.ts

import * as crypto from "crypto";
import { env } from "../config/config";

const algorithm = "aes-256-cbc";
const key = env.key.privateKey;

function encrypt(text: string): { iv: string; encryptedData: string } {
  const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encryptedData: encrypted };
}

function decrypt(encryptedData: string, iv: string): string {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export { encrypt, decrypt };
