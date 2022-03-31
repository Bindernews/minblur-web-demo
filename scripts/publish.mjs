import { rename, rm } from "node:fs/promises";
import { execSync } from "node:child_process";
(async () => {
  await rm("./public", { recursive: true });
  execSync("npm run build");
  await rm("./public/build/bundle.js.map");
  execSync("git switch gh-pages");
  await rm("./docs", { recursive: true });
  await rename("./public", "./docs");
})();
