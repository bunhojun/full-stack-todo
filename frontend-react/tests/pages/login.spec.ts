import { test, expect } from '@playwright/test';
import { AuthModel } from '../page-object-models/AuthModel';

test('login', async ({ page }) => {
  const authModel = new AuthModel(page);
  await authModel.login();
  await expect(page).toHaveURL('/');
});
