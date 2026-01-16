import { test, expect } from '@playwright/test';
import { AuthModel } from '../page-object-models/AuthModel';

test('login success', async ({ page }) => {
  const authModel = new AuthModel(page);
  const user = await authModel.signup();
  await authModel.login(user);
  await expect(page).toHaveURL('/');
});
