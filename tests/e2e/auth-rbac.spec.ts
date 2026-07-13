import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function expectNoA11yViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, results.violations.map((violation) => `${violation.id}: ${violation.help}`).join('\n')).toEqual([]);
}

test.describe('Auth.js demo and cross-port RBAC', () => {
  test('anonymous users see the single customer login', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveURL(/localhost:3000\/login/);
    await expect(page.getByRole('heading', { name: /acesse sua conta/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar como cliente/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar como operador/i })).toBeVisible();
    await expectNoA11yViolations(page);
    await page.screenshot({ path: 'docs/screenshots/auth-login.png', fullPage: true });

    await page.goto('http://localhost:3001/');
    await expect(page).toHaveURL('http://localhost:3000/login?error=unauthorized');
    await expect(page.getByText('Você não tem permissão para acessar essa área.')).toBeVisible();
  });

  test('demo customer stays in customer and cannot open operator', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.getByRole('button', { name: /entrar como cliente/i }).click();
    await expect(page).toHaveURL('http://localhost:3000/');

    const session = await page.request.get('http://localhost:3000/api/auth/session');
    expect(session.ok()).toBeTruthy();
    expect((await session.json()).user.role).toBe('customer');

    const amount = page.getByLabel(/valor solicitado/i);
    await expect(amount).toHaveValue('0,00');
    await amount.pressSequentially('2500000');
    await expect(amount).toHaveValue('25.000,00');
    await expectNoA11yViolations(page);
    await page.screenshot({ path: 'docs/screenshots/auth-customer-home.png', fullPage: true });

    await page.goto('http://localhost:3001/');
    await expect(page).toHaveURL('http://localhost:3000/login?error=unauthorized');
  });

  test('demo operator is redirected to the operator dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.getByRole('button', { name: /entrar como operador/i }).click();
    await expect(page).toHaveURL('http://localhost:3001/');

    const session = await page.request.get('http://localhost:3001/api/auth/session');
    expect(session.ok()).toBeTruthy();
    expect((await session.json()).user.role).toBe('operator');

    await expect(page.getByRole('region', { name: /eficiência operacional/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /portfólio de crédito/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /últimas decisões do sistema agêntico/i })).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(5);
    await expectNoA11yViolations(page);
    await page.screenshot({ path: 'docs/screenshots/auth-operator-dashboard.png', fullPage: true });

    await page.goto('http://localhost:3000/');
    await expect(page).toHaveURL('http://localhost:3001/');
  });

  test('login and dashboards remain usable on mobile with reduced motion', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('http://localhost:3000/login');
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();

    await page.getByRole('button', { name: /entrar como operador/i }).click();
    await expect(page).toHaveURL('http://localhost:3001/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();

    const perceptibleAnimations = await page.locator('*').evaluateAll((elements) =>
      elements.filter((element) => {
        const styles = getComputedStyle(element);
        if (styles.animationName === 'none') return false;
        return styles.animationDuration.split(',').some((duration) => {
          const value = Number.parseFloat(duration);
          return duration.trim().endsWith('ms') ? value > 1 : value > 0.001;
        });
      }).length,
    );
    expect(perceptibleAnimations).toBe(0);
  });
});
