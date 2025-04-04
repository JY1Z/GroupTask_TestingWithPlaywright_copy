import { test, expect } from "@playwright/test";
import fs from "fs";

test("Record salary information", async ({ page }) => {
  test.setTimeout(30000);

  await page.goto("https://www.ilry.fi/en/");

  await page.getByRole("button", { name: "Allow all cookies" }).click();

  await page.waitForTimeout(1000);

  await page.locator("button.search-toggle").click();

  await page
    .getByRole("textbox", { name: "Search input" })
    .waitFor({ state: "visible" });
  await page.getByRole("textbox", { name: "Search input" }).click();
  await page
    .getByRole("textbox", { name: "Search input" })
    .fill("salary information for engineers graduating in 2025");

  const salaryLink = page.getByRole("link", {
    name: "https://www.ilry.fi/en/starting-a-career/working-student/students-salary-",
  });
  await salaryLink.waitFor({ state: "visible", timeout: 10000 });
  await salaryLink.click();

  await page.waitForLoadState("networkidle");

  // Salary table
  const table = page.getByRole("table").first();
  await expect(table).toBeVisible();

  // Get the salary data using cell selectors
  const salaryData = {};

  try {
    const rows = await table.getByRole("row").all();

    const headerCells = await rows[0].getByRole("cell").all();
    const limitedExpText = await headerCells[1].textContent();
    const significantExpText = await headerCells[2].textContent();

    const capitalRegionCells = await rows[1].getByRole("cell").all();
    const capitalRegionText = await capitalRegionCells[0].textContent();
    const capitalRegionLimited = await capitalRegionCells[1].textContent();
    const capitalRegionSignificant = await capitalRegionCells[2].textContent();

    const otherRegionCells = await rows[2].getByRole("cell").all();
    const otherRegionsText = await otherRegionCells[0].textContent();
    const otherRegionsLimited = await otherRegionCells[1].textContent();
    const otherRegionsSignificant = await otherRegionCells[2].textContent();

    salaryData[capitalRegionText.trim()] = {
      [limitedExpText.trim()]: capitalRegionLimited.trim(),
      [significantExpText.trim()]: capitalRegionSignificant.trim(),
    };

    salaryData[otherRegionsText.trim()] = {
      [limitedExpText.trim()]: otherRegionsLimited.trim(),
      [significantExpText.trim()]: otherRegionsSignificant.trim(),
    };
  } catch (error) {
    console.log("Error extracting data from table:", error);
  }

  fs.writeFileSync(
    "engineer-salary-data.json",
    JSON.stringify(salaryData, null, 2)
  );
  console.log("Salary information is saved to engineer-salary-data.json");

  console.log("Engineer Salary Information:");
  console.log(JSON.stringify(salaryData, null, 2));
});
