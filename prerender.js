const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const history = require("connect-history-api-fallback");

const routes = ["/", "/about", "/login", "/signup"];
const buildDir = path.join(__dirname, "input", "dist");
const outputDir = path.join(__dirname, "output");

async function prerenderSPA() {
  // Serve your SPA locally
  const app = express();
  app.use(history());
  app.use(express.static(buildDir));
  const server = app.listen(8080);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let route of routes) {
    // Navigate to the route
    await page.goto(`http://localhost:8080${route}`, {
      waitUntil: "networkidle0",
    });

    // Get the prerendered HTML
    const html = await page.content();

    // Write the prerendered HTML to the output directory
    const outputPath = path.join(outputDir, route);
    fs.mkdirSync(outputPath, { recursive: true });
    fs.writeFileSync(path.join(outputPath, "index.html"), html);
  }

  await browser.close();
  server.close();
}

prerenderSPA().catch(console.error);
