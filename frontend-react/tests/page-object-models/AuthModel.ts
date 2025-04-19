import { type Page } from '@playwright/test';
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
    // First ensure we're authenticated by waiting for a successful auth response
    const authResponse = await this.page.request.get(
      'http://localhost:3000/auth',
      {
        failOnStatusCode: false,
      },
    );

    // If auth failed, we need to re-authenticate
    if (authResponse.status() === 401) {
      // We're already on the login page or will be redirected there
      // Let's wait for any navigation to complete
      await this.page.waitForLoadState('networkidle');
    }

    // Now navigate to the requested page
    await this.page.goto(path);

    // Instead of waiting for a specific auth response that might not come,
    // wait for the page to be fully loaded and stable
    await this.page.waitForLoadState('networkidle');

    // Verify we're on the expected page and not redirected to login
    const currentUrl = this.page.url();
    if (currentUrl.includes('/login')) {
      throw new Error(`Navigation to ${path} failed, redirected to login page`);
    }
  }
}
