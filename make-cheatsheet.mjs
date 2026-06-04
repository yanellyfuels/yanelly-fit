/* Renders guides/cheat-sheet.html to a print-ready PDF lead magnet.
   Run:  node make-cheatsheet.mjs  */
import puppeteer from "puppeteer";
import { join } from "path";

const src = "file://" + join(process.cwd(), "guides", "cheat-sheet.html");
const out = join(process.cwd(), "guides", "balanced-plate-cheat-sheet.pdf");

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.goto(src, { waitUntil: "networkidle0", timeout: 30000 });
await new Promise((r) => setTimeout(r, 500)); // let fonts load
await page.pdf({ path: out, format: "Letter", printBackground: true, preferCSSPageSize: true });

// Also export a preview image to show on the site (what they're signing up for)
await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1.5 });
await page.goto(src, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 400));
const preview = join(process.cwd(), "guides", "cheat-sheet-preview.png");
await page.screenshot({ path: preview, clip: { x: 0, y: 0, width: 816, height: 1056 } });

await browser.close();
console.log("Wrote", out, "and", preview);
