import {test, expect} from '@playwright/test';
import { createReviewForms, createNewReviewCycleTillForms, setupCustomAttributes } from '../functions/helperFunctions';
test('custom-attributes-flow', async({page})=>{
    test.setTimeout(90000);
    await(createNewReviewCycleTillForms(page));
    await(setupCustomAttributes(page));
    await(createReviewForms(page));
    await page.waitForTimeout(2000);
});