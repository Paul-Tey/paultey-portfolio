import { spawn } from "node:child_process";
import { resolve } from "node:path";

const viteCli = resolve("node_modules", "vite", "bin", "vite.js");
const playwrightCli = resolve("node_modules", "@playwright", "test", "cli.js");

function run(command, args, environment = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: environment,
      stdio: "inherit",
      windowsHide: true,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

try {
  await run(process.execPath, [viteCli, "build"], {
    ...process.env,
    VITE_TURNSTILE_SITE_KEY: "smoke-test-site-key",
  });
  await run(process.execPath, [playwrightCli, "test"]);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
