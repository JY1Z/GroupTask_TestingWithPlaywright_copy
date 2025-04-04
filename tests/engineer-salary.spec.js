import { test, expect } from "@playwright/test";
import fs from "fs";

test("Record salary information", async ({ page }) => {
  test.setTimeout(15000);

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
  const table = page.locator("table").first();
  await expect(table).toBeVisible();

  // Get the salary data using cell selectors
  const salaryData = {};

  try {
    const capitalRegionText = await table
      .locator("tr")
      .nth(1)
      .locator("td")
      .first()
      .textContent();
    const otherRegionsText = await table
      .locator("tr")
      .nth(2)
      .locator("td")
      .first()
      .textContent();

    const limitedExpText = await table
      .locator("tr")
      .first()
      .locator("td")
      .nth(1)
      .textContent();
    const significantExpText = await table
      .locator("tr")
      .first()
      .locator("td")
      .nth(2)
      .textContent();

    const capitalRegionLimited = await table
      .locator("tr")
      .nth(1)
      .locator("td")
      .nth(1)
      .textContent();
    const capitalRegionSignificant = await table
      .locator("tr")
      .nth(1)
      .locator("td")
      .nth(2)
      .textContent();
    const otherRegionsLimited = await table
      .locator("tr")
      .nth(2)
      .locator("td")
      .nth(1)
      .textContent();
    const otherRegionsSignificant = await table
      .locator("tr")
      .nth(2)
      .locator("td")
      .nth(2)
      .textContent();

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

    const tableData = await table.evaluate((table) => {
      const data = {};
      const rows = table.querySelectorAll("tr");

      const headers = Array.from(rows[0].querySelectorAll("td")).map((cell) =>
        cell.textContent.trim()
      );

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");
        const region = cells[0].textContent.trim();
        data[region] = {};

        for (let j = 1; j < cells.length; j++) {
          if (headers[j]) {
            data[region][headers[j]] = cells[j].textContent.trim();
          }
        }
      }

      return data;
    });
    Object.assign(salaryData, tableData);
  }

  fs.writeFileSync(
    "engineer-salary-data.json",
    JSON.stringify(salaryData, null, 2)
  );
  console.log("Salary information is saved to engineer-salary-data.json");

  console.log("Engineer Salary Information:");
  console.log(JSON.stringify(salaryData, null, 2));
});
