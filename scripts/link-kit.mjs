#!/usr/bin/env node
/**
 * Point this app's `@handharr-labs/*` packages at the LOCAL forge-kit source so
 * a kit bug-fix takes effect in `next dev` immediately — no publish, no reinstall.
 *
 * Mechanism: replace each consumed package's `node_modules/@handharr-labs/<pkg>`
 * with a symlink to `web-forge-kit/packages/<pkg>`. The kit ships raw TS source
 * that this app already `transpilePackages`, so edits are picked up live. The
 * symlink keeps the package under `node_modules`, so Tailwind's node_modules
 * `@source` globs and forge-auth's subpath `exports` both keep working.
 *
 * The installed (published) copy is backed up to `<pkg>.published-bak`, so
 * `--unlink` restores it OFFLINE (no GitHub Packages auth / download needed).
 *
 *   node scripts/link-kit.mjs            # link -> local kit
 *   node scripts/link-kit.mjs --unlink   # restore published copies
 *
 * Kit location: ../web-forge-kit by default, or set FORGE_KIT_PATH.
 */
import { existsSync, lstatSync, readFileSync, renameSync, rmSync, symlinkSync } from "node:fs";
import { resolve } from "node:path";

const appRoot = process.cwd();
const unlink = process.argv.includes("--unlink");
const kitPath = process.env.FORGE_KIT_PATH
  ? resolve(process.env.FORGE_KIT_PATH)
  : resolve(appRoot, "..", "web-forge-kit");

const pkgJson = JSON.parse(readFileSync(resolve(appRoot, "package.json"), "utf8"));
const names = Object.keys({ ...pkgJson.dependencies, ...pkgJson.devDependencies }).filter(
  (n) => n.startsWith("@handharr-labs/"),
);

if (names.length === 0) {
  console.error("No @handharr-labs/* dependencies found in package.json.");
  process.exit(1);
}
if (!unlink && !existsSync(kitPath)) {
  console.error(`Kit not found at ${kitPath}. Set FORGE_KIT_PATH to your web-forge-kit checkout.`);
  process.exit(1);
}

const nm = resolve(appRoot, "node_modules");
const isSymlink = (p) => existsSync(p) && lstatSync(p).isSymbolicLink();
let done = 0;

for (const name of names) {
  const short = name.slice("@handharr-labs/".length); // e.g. forge-auth
  const linkPath = resolve(nm, name);
  const bakPath = `${linkPath}.published-bak`;
  const target = resolve(kitPath, "packages", short);

  if (unlink) {
    if (isSymlink(linkPath)) rmSync(linkPath, { recursive: true, force: true });
    if (existsSync(bakPath)) {
      if (existsSync(linkPath)) rmSync(linkPath, { recursive: true, force: true });
      renameSync(bakPath, linkPath);
      console.log(`restored   ${name}`);
      done++;
    }
    continue;
  }

  if (!existsSync(target)) {
    console.error(`SKIP       ${name}: not found at ${target}`);
    continue;
  }
  if (isSymlink(linkPath)) {
    console.log(`already    ${name}`);
    done++;
    continue;
  }
  // Back up the published copy once, then symlink to local source.
  if (existsSync(linkPath) && !existsSync(bakPath)) renameSync(linkPath, bakPath);
  else if (existsSync(linkPath)) rmSync(linkPath, { recursive: true, force: true });
  symlinkSync(target, linkPath, "dir");
  console.log(`linked     ${name} -> ${target}`);
  done++;
}

console.log(`\n${unlink ? "Unlink" : "Link"} complete: ${done}/${names.length} package(s).`);
if (!unlink) {
  console.log(
    "Local kit source is now linked. Use `npm run local-dev` (webpack) — plain\n" +
      "`npm run dev` (Turbopack) can't resolve the kit's symlinked subpath exports.\n" +
      "Run `npm run kit:unlink` to restore the published packages.",
  );
}
