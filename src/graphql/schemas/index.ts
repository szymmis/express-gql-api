import { mergeTypeDefs } from "@graphql-tools/merge";
import fs from "fs";
import path from "path";
import url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const schemas = fs
  .readdirSync(__dirname)
  .filter((file) => file.endsWith(".graphql"))
  .map((file) => fs.readFileSync(path.join(__dirname, file), "utf8"));

export default mergeTypeDefs(schemas);
