import { expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { User } from '../../src/types/user.type';

export class AuthModel {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async signup(): Promise<User> {
    const userName = faker.internet.username();
    const uniqueEmail = `${userName}+${Date.now()}@example.com`;
    const password = faker.internet.password();

    await this.page.goto('/signup');
    const inputName = this.page.locator("input[data-testid='name']");
    await inputName.fill(userName);
    const inputEmail = this.page.locator("input[data-testid='email']");
    await inputEmail.fill(uniqueEmail);
    const inputPassword = this.page.locator("input[data-testid='password']");
    await inputPassword.fill(password);
    await this.page.locator("button[data-testid='submit']").click();
    const res = await this.page.waitForResponse(
      'http://localhost:3000/auth/login',
    );
    const response = await res.json();
    return {
      ...response,
      password,
    };
  }

  async login(user: User) {
    await this.page.goto('/login');

    const inputEmail = this.page.locator("input[data-testid='email']");
    await inputEmail.fill(user.email);
    const inputPassword = this.page.locator("input[data-testid='password']");
    await inputPassword.fill(user.password);

    const buttonSubmit = this.page.locator("button[data-testid='submit']");
    await buttonSubmit.click();
    await this.page.waitForResponse('http://localhost:3000/auth/login');
  }

  async goToAuthedPage(path: string) {
    // use Promise.all as a workaround for browser navigation issue
    await Promise.all([
      this.page.goto(path),
      this.page.waitForResponse('http://localhost:3000/auth'),
    ]);
  }
}
