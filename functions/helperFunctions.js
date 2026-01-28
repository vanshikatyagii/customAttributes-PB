import { expect } from '@playwright/test';

export async function createNewReviewCycleTillForms(page) {
  
  await page.goto('http://api.demo.peoplebox.ai/demo/try_interactive_demo?account_id=1147');
  await page.waitForLoadState('networkidle');

  await page.getByRole('link', { name: 'Reviews', exact: true }).click();
  await page.getByRole('button', { name: 'Create New Cycle' }).click();
  await page.getByRole('button', { name: 'Create Performance Review' }).click();

  await page.locator('#review-name').fill('custom attributes test');
  await page.getByRole('button', { name: 'Save & Continue' }).click();

  await expect(page.getByText('Configure steps of this review cycle')).toBeVisible();
  const toggles = page.locator('button.ant-switch');

  if (!(await toggles.nth(0).getAttribute('class')).includes('checked')) {
    await toggles.nth(0).click();
  }

  if (!(await toggles.nth(1).getAttribute('class')).includes('checked')) {
    await toggles.nth(1).click();
  }

  await page.getByRole('button', { name: 'Save & Continue' }).click();
  await expect(page.getByText('Create customizable review forms with relevant questions')).toBeVisible();
}

export async function setupCustomAttributes(page) {
  const customAttributeToggle = page.locator('button.ant-switch').first();
  await customAttributeToggle.scrollIntoViewIfNeeded();
  await expect(customAttributeToggle).toBeVisible();

  if (!(await customAttributeToggle.getAttribute('class')).includes('checked')) {
    await customAttributeToggle.click();
  }

  const selector = page.locator('.ant-select-selector');
  await selector.click();

  const input = page.locator('.ant-select-selection-search-input').last();

  await input.fill('Attribute1');
  await input.press('Enter');

  await input.fill('Attribute2');
  await input.press('Enter');

  const attributeTags = page.locator('.custom-attribute-tag');

  await expect(attributeTags.filter({ hasText: 'Attribute1' })).toBeVisible({ timeout: 1000 });
  await expect(attributeTags.filter({ hasText: 'Attribute2' })).toBeVisible({ timeout: 1000 });

  await page.evaluate(() => {
    const active = document.activeElement;
    if (active && typeof active.blur === 'function') {
      active.blur();
    }
  });

  await expect(page.locator('.ant-select-dropdown')).toBeHidden({ timeout: 10000 });
}

async function switchFormAttribute(page, attributeName) {
  await page.locator('#root').getByText(/attribute/i).click();
  await page.getByRole('menuitem', { name: attributeName }).click();
  await expect(page.locator('.ant-select-dropdown')).toBeHidden();
}

export async function createReviewForms(page) {

  // -------- SELF REVIEW --------
  await page.getByRole('button',{name:'Edit Form'}).first().click()
  await page.waitForTimeout(1500);
  
  await switchFormAttribute(page, 'attribute1');
  await page.getByRole('button', { name: 'Add' }).first().click();
  await page.waitForTimeout(2500);
  await page.getByRole('button', { name: 'Add' }).first().click();
  await page.waitForTimeout(2500);

  await switchFormAttribute(page, 'attribute2');
  await page.getByRole('button', { name: 'Add' }).first().click();
  await page.waitForTimeout(2500);
  await page.getByRole('button', { name: 'Add' }).nth(2).click();
  await page.waitForTimeout(2500);

  await page.locator('div:nth-child(10) > .flex.justify-between > .ant-btn').click();
  await page.getByRole('button', { name: 'Save & Continue' }).click();

  // -------- PEER REVIEW --------
  await page.getByRole('button',{name:'Edit Form'}).nth(1).click()
  await page.waitForTimeout(1500);
  
  await switchFormAttribute(page, 'attribute1');
  await page.getByRole('button', { name: 'Add' }).first().click();
  await page.waitForTimeout(2500);
  await page.getByRole('button', { name: 'Add' }).first().click();
  await page.waitForTimeout(2500);

  await switchFormAttribute(page, 'attribute2');
  await page.getByRole('button', { name: 'Add' }).first().click();
  await page.waitForTimeout(2500);
  await page.getByRole('button', { name: 'Add' }).nth(2).click();
  await page.waitForTimeout(2500);

  await page.getByRole('button', { name: 'Save & Continue' }).click();
}
