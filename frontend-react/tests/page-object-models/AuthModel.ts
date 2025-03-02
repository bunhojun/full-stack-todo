import { type Page } from '@playwright/test';

export class AuthModel {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async login() {
    await this.page.goto('/login');

    const inputEmail = this.page.locator("input[data-testid='email']");
    await inputEmail.fill('test@test.example.com');
    const inputPassword = this.page.locator("input[data-testid='password']");
    await inputPassword.fill('password!');

    const buttonSubmit = this.page.locator("button[data-testid='submit']");
    await buttonSubmit.click();
  }
}
