import { createReadStream } from "node:fs";
const { createHash } = await import("node:crypto");

export const calculateHash = async (path) => {
  const input = createReadStream(path);
  const hash = createHash("sha256");
  input.on("readable", async () => {
    const data = input.read();
    if (data) {
      hash.update(data);
    } else {
      console.log(hash.digest("hex"));
      return;
    }
  });
};
