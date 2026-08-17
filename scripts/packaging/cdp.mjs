/**
 * A very small Chrome DevTools Protocol client.
 *
 * Screenshots need more control than `chrome --screenshot` gives — we have to
 * click a tab and wait for it to render before capturing — but pulling in
 * Playwright for that would add a large dependency to a repository whose whole
 * point is that its products have none. Node 22 ships a global WebSocket, so
 * the protocol can be spoken directly in about a hundred lines.
 *
 * Chromium is already installed in this environment; CHROME_PATH overrides the
 * search if yours lives elsewhere.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { request } from "node:http";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

function findChrome() {
  const found = CHROME_CANDIDATES.find((path) => existsSync(path));
  if (!found) {
    throw new Error(
      `No Chrome or Chromium found. Set CHROME_PATH to the binary. Looked in:\n  ${CHROME_CANDIDATES.join("\n  ")}`
    );
  }
  return found;
}

/** Plain node:http so the localhost call can never be routed via a proxy. */
function getJson(port, path) {
  return new Promise((resolve, reject) => {
    const req = request({ host: "127.0.0.1", port, path, method: "GET" }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(new Error(`Bad DevTools response from ${path}: ${error.message}`));
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class Browser {
  constructor(process, ws) {
    this.process = process;
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(`${message.error.message} (${message.method})`));
        else resolve(message.result);
      } else if (message.method) {
        for (const listener of this.listeners.get(message.method) ?? []) listener(message.params);
      }
    });
  }

  static async launch({ port = 9333, width = 1440, height = 900 } = {}) {
    const chrome = spawn(findChrome(), [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--force-color-profile=srgb",
      "--font-render-hinting=none",
      "--allow-file-access-from-files",
      `--remote-debugging-port=${port}`,
      `--window-size=${width},${height}`,
      "about:blank",
    ]);
    chrome.stderr.on("data", () => {}); // Chromium is loud about dbus; ignore it.

    let targets = null;
    for (let attempt = 0; attempt < 80; attempt++) {
      try {
        targets = await getJson(port, "/json/list");
        if (targets.some((t) => t.type === "page")) break;
      } catch {
        // Not up yet.
      }
      await sleep(125);
    }

    const page = targets?.find((t) => t.type === "page");
    if (!page) {
      chrome.kill();
      throw new Error("Chromium did not expose a page target within 10 seconds");
    }

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve, { once: true });
      ws.addEventListener("error", () => reject(new Error("DevTools socket failed")), {
        once: true,
      });
    });

    const browser = new Browser(chrome, ws);
    await browser.send("Page.enable");
    await browser.send("Runtime.enable");
    return browser;
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`${method} timed out after 30s`));
        }
      }, 30_000);
    });
  }

  on(method, listener) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(listener);
  }

  once(method) {
    return new Promise((resolve) => {
      const listener = (params) => {
        const list = this.listeners.get(method);
        list.splice(list.indexOf(listener), 1);
        resolve(params);
      };
      this.on(method, listener);
    });
  }

  async setViewport(width, height, deviceScaleFactor = 2) {
    await this.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor,
      mobile: false,
    });
  }

  async goto(url, { settleMs = 700 } = {}) {
    const loaded = this.once("Page.loadEventFired");
    await this.send("Page.navigate", { url });
    await Promise.race([loaded, sleep(12_000)]);
    await sleep(settleMs);
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description ?? "evaluate failed");
    }
    return result.result.value;
  }

  /**
   * Clicks the first visible control whose text contains `label`, ignoring
   * emoji and case. Returns false rather than throwing when there is no match,
   * because a product without that tab should still get its other screenshots.
   */
  async clickByLabel(label) {
    const found = await this.evaluate(`(() => {
      // The label is normalised the same way as the element text, so a search
      // for "30-Day" still matches a tab reading "📅 30-Day Plan".
      const normalise = (s) => (s || '').replace(/[^\\p{L}\\p{N} ]/gu, '').replace(/\\s+/g, ' ').trim().toLowerCase();
      const wanted = normalise(${JSON.stringify(label)});
      const candidates = document.querySelectorAll(
        'button, a, [role="tab"], [data-tab], [data-panel], li[tabindex], .tab, .nav-item'
      );
      for (const el of candidates) {
        const text = normalise(el.textContent);
        if (!text || !text.includes(wanted)) continue;
        const box = el.getBoundingClientRect();
        if (box.width < 4 || box.height < 4) continue;
        el.click();
        return true;
      }
      return false;
    })()`);
    if (found) await sleep(550);
    return found;
  }

  async screenshot({ width, height, fullPage = false } = {}) {
    const params = { format: "png", captureBeyondViewport: fullPage };
    if (width && height) params.clip = { x: 0, y: 0, width, height, scale: 1 };
    const { data } = await this.send("Page.captureScreenshot", params);
    return Buffer.from(data, "base64");
  }

  async close() {
    try {
      this.ws.close();
    } catch {
      // Already gone.
    }
    this.process.kill();
    await sleep(150);
  }
}
