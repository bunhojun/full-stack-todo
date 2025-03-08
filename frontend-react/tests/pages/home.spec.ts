import { Page, test } from '@playwright/test';
import { AuthModel } from '../page-object-models/AuthModel';

let page: Page;
let authModel: AuthModel;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  authModel = new AuthModel(page);
  await authModel.signup();
});

test('add task success', async () => {
  await authModel.goToAuthedPage('/');
  const inputTask = page.locator("input[data-testid='task']");
  await inputTask.fill('new task');
  const buttonAddTask = page.locator("button[data-testid='submit']");
  await buttonAddTask.click();
  await page.waitForResponse('http://localhost:3000/tasks');
  await page.waitForSelector("td[data-testid='new task']:has-text('new task')");
});
