import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import puppeteer from "puppeteer";
import { IJSONData, ILanguageItem } from "../types";

export const scrapeData = async (username: string) => {
  console.log(`Scrapping for ${username}`);

  await mkdir(join(__dirname, "..", "data")).catch(() => null);

  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();

    await page.goto(`https://wakatime.com/@${username}`);

    await page.setViewport({ width: 1920, height: 1080 });

    const element = await page.waitForSelector(
      "div#languages>div.metrics-table",
      { timeout: 60000 }
    );

    if (!element) return await browser.close();

    const text = await element?.evaluate((el) => el.innerText);

    const languages: ILanguageItem[] = text
      ?.split("%\n")
      .map((lang) => {
        const [name, percentage] = lang.split("\n");
        return { name, percentage: +percentage.replace("%", "") };
      })
      .filter((l) => l.percentage > 0);

    if (languages.length === 0) return await browser.close();

    const data: IJSONData = {
      updated_at: +(Date.now() / 1000).toFixed(0),
      languages,
    };

    writeFile(
      join(__dirname, "..", "data", `${username}.json`),
      JSON.stringify(data, null, 2)
    );

    await browser.close();
  } catch (error) {
    console.log("Error scraping : ", error);
    await browser.close();
  }
};
