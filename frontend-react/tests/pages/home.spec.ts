import { Page, test } from '@playwright/test';
import { AuthModel } from '../page-object-models/AuthModel';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await new AuthModel(page).signup();
});

test('add task', async () => {
  await page.goto('/');
  const inputTask = page.locator("input[data-testid='task']");
  await inputTask.fill('new task');
  const buttonAddTask = page.locator("button[data-testid='submit']");
  await buttonAddTask.click();
  await page.waitForResponse('http://localhost:3000/tasks');
  await page.waitForSelector("td[data-testid='new task']:has-text('new task')");
});
