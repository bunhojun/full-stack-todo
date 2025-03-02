import { test, expect } from '@playwright/test';
import { AuthModel } from '../page-object-models/AuthModel';

test('login', async ({ page }) => {
  // request
  const authModel = new AuthModel(page);
  await authModel.login();
  const responsePromise = page.waitForResponse(
    'http://localhost:3000/auth/login',
  );
  const response = await (await responsePromise).json();
  console.log(response);
  await expect(page).toHaveURL('/');
});
