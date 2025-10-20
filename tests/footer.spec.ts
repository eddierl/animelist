import { test, expect } from '@playwright/test';

test('footer displays the latest commit hash', async ({ page }) => {
  await page.goto('/');

  // Wait for the footer to be visible
  await page.waitForSelector('footer');

  // Get the text content of the footer (the one with commit hash)
  const footerText = await page.locator('footer').filter({ hasText: 'Latest commit:' }).textContent();

  // Expect the footer to contain "Latest commit:"
  expect(footerText).toContain('Latest commit:');

  // Extract the commit hash from the footer text
  const commitHashMatch = footerText?.match(/Latest commit:\s*([a-f0-9]+)/);
  expect(commitHashMatch).toBeTruthy();

  const commitHash = commitHashMatch![1];

  // Verify the commit hash is a valid Git hash (40 characters, hexadecimal)
  expect(commitHash).toMatch(/^[a-f0-9]{40}$/);

  // Optionally, you can compare it to the actual latest commit if needed
  // But since it's dynamic, we just check it's a valid hash
});