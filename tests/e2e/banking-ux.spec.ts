import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function loginAs(page: import('@playwright/test').Page, role: 'cliente' | 'operador') {
  await page.goto('http://localhost:3000/login');
  await page.getByRole('button', { name: new RegExp(`entrar como ${role}`, 'i') }).click();
  await expect(page).toHaveURL(role === 'cliente' ? 'http://localhost:3000/' : 'http://localhost:3001/');
}

async function expectNoSeriousA11yViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
  expect(blocking, blocking.map((violation) => `${violation.id}: ${violation.help}`).join('\n')).toEqual([]);
}

test.describe('Banking UX', () => {
  test('customer sees banking language and a fluid workflow', async ({ page }) => {
    await loginAs(page, 'cliente');

    await expect(page.getByRole('banner').getByText('Internet Banking', { exact: true })).toBeVisible();
    await expect(page.getByText('> Minhas Propostas', { exact: true })).toBeVisible();
    await expect(page.getByText('> Extrato de Propostas', { exact: true })).toBeVisible();
    await expect(page.getByText('> Minha Conta', { exact: true })).toBeVisible();
    await expect(page.getByText('Análise de crédito rápida e segura')).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await page.screenshot({ path: 'docs/screenshots/banking-home.png', fullPage: true });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({ path: 'docs/screenshots/banking-home-mobile.png', fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('http://localhost:3000/status/banking-test?cpf=123.456.789-00&amount=25000');
    await expect(page.getByRole('heading', { name: /acompanhe sua proposta/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /o que está acontecendo agora/i })).toBeVisible();
    await expect(page.locator('[data-workflow-status="active"]')).toHaveCount(1, { timeout: 4_000 });
    await expect(page.locator('[data-workflow-spinner]')).toBeVisible();
    expect(await page.locator('[data-workflow-status="queued"]').count()).toBeGreaterThan(0);
    await expect(page.getByText('Aguardando', { exact: true }).first()).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await page.screenshot({ path: 'docs/screenshots/banking-workflow-mid.png', fullPage: true });

    await expect(page.getByText('Proposta aprovada · seu crédito está disponível')).toBeVisible({ timeout: 12_000 });
    await expect(page.locator('[data-workflow-status="done"]')).toHaveCount(5);
    await page.screenshot({ path: 'docs/screenshots/banking-workflow-done.png', fullPage: true });
  });

  test('settings persist preferences, toggle debug and sign out', async ({ page }) => {
    await loginAs(page, 'cliente');
    await page.goto('http://localhost:3000/configuracoes');

    await expect(page.getByRole('heading', { name: /minha conta/i })).toBeVisible();
    await expect(page.getByRole('tab')).toHaveCount(3);
    await expectNoSeriousA11yViolations(page);
    await page.screenshot({ path: 'docs/screenshots/banking-settings.png', fullPage: true });

    await page.getByRole('tab', { name: 'Notificações' }).click();
    const emailToggle = page.getByRole('switch', { name: 'Receber resultado por e-mail' });
    await emailToggle.click();
    await expect(emailToggle).toHaveAttribute('aria-checked', 'true');
    await page.reload();
    await page.getByRole('tab', { name: 'Notificações' }).click();
    await expect(page.getByRole('switch', { name: 'Receber resultado por e-mail' })).toHaveAttribute('aria-checked', 'true');

    await page.getByRole('tab', { name: 'Exibição' }).click();
    await page.getByRole('switch', { name: 'Modo debug' }).click();
    await expect(page.getByLabel('Debug mode')).toBeVisible();

    await page.getByRole('tab', { name: 'Perfil' }).click();
    await page.getByRole('button', { name: 'Sair da conta' }).last().click();
    await expect(page).toHaveURL(/localhost:3000\/login/);
  });

  test('workflow animations collapse under reduced motion and operator can sign out', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await loginAs(page, 'cliente');
    await page.goto('http://localhost:3000/status/banking-reduced?cpf=123.456.789-00&amount=25000');
    await expect(page.locator('[data-workflow-status="active"]')).toHaveCount(1);
    const duration = await page.locator('[data-workflow-status="active"] article > div').last().evaluate((element) => getComputedStyle(element).transitionDuration);
    expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);

    await page.context().clearCookies();
    await loginAs(page, 'operador');
    await page.getByRole('button', { name: 'Sair da conta' }).click();
    await expect(page).toHaveURL(/localhost:3000\/login/);
  });
});
