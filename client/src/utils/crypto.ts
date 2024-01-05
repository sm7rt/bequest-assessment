import { SHA256 } from "crypto-js";

const SECRET_KEY = "05431e4b5b6e2f6588cf2423f99b2f13";

export const createHash = (data: string) => {
  return SHA256(data + SECRET_KEY).toString();
};
