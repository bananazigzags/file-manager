import { createReadStream } from "node:fs";
const { createHash } = await import("node:crypto");

export const calculateHash = async (path) => {
  return new Promise((resolve, reject) => {
    const input = createReadStream(path);
    const hash = createHash("sha256");
    input.on("readable", async () => {
      const data = input.read();
      if (data) {
        hash.update(data);
      } else {
        resolve(hash.digest("hex"));
      }
    });
  });
};
