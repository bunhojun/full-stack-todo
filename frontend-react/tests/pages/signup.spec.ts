import { expect, test } from '@playwright/test';
import { AuthModel } from '../page-object-models/AuthModel';

test('signup success', async ({ page }) => {
  const authModel = new AuthModel(page);
  await authModel.signup();
  await expect(page).toHaveURL('/');
});
