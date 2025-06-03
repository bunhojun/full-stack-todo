import { Page, test } from '@playwright/test';
import { AuthModel } from '../page-object-models/AuthModel';

let page: Page;
let authModel: AuthModel;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  authModel = new AuthModel(page);
  const user = await authModel.signup();
  await authModel.login(user);
});

test('add task success', async () => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const inputTask = page.locator("input[data-testid='add-task']");
  await inputTask.fill('new task');
  const buttonAddTask = page.locator("button[data-testid='submit']");
  await buttonAddTask.click();
  await page.waitForResponse('http://localhost:3000/tasks');
  await page.waitForSelector("td[data-testid='new task']:has-text('new task')");
});
