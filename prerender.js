const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// TODO: improve this array to be a CLI command or a json file
const routes = ["/", "/about", "/login", "/signup"]; 
// TODO: improve this to be a CLI command
const buildDir = "path/to/your/spa/dist"; 
// TODO: improve this to be a CLI command
const outputDir = "path/to/output";

async function prerenderSPA() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const route of routes) {
    const url = `file://${path.join(buildDir, route, "index.html")}`;
    await page.goto(url, { waitUntil: "networkidle0" });

    const content = await page.content();
    const outputPath = path.join(outputDir, route, "index.html");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content);
  }

  await browser.close();
}

prerenderSPA().catch((e) => console.error(e));
