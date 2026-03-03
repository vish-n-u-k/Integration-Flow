import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const homepagePath = path.join(__dirname, "..", "app", "page.tsx");
const homepageContent = fs.readFileSync(homepagePath, "utf-8");

describe("Homepage", () => {
  it("should have a footer with copyright info", () => {
    expect(homepageContent).toContain("<footer");
    expect(homepageContent.toLowerCase()).toContain("copyright");
  });

  it("should display the current year", () => {
    const currentYear = new Date().getFullYear().toString();
    expect(homepageContent).toContain(currentYear);
  });
});
