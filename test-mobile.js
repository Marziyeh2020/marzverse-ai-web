/* eslint-disable */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Emulate iPhone 13
  await page.emulate(puppeteer.KnownDevices['iPhone 13']);

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  page.on('requestfailed', request => {
    console.error('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 15000 });
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('BODY TEXT:', bodyText);
    
    // Take a screenshot to visually verify what is rendered
    await page.screenshot({ path: 'screenshot.png' });
    console.log('Screenshot saved to screenshot.png');
    
    if (bodyText.includes('Marzverse') || bodyText.includes('MARZVERSE')) {
      console.log('RESULT: PAGE RENDERED');
    } else {
      console.log('RESULT: PAGE NOT RENDERED. Checking body HTML dump:');
      const bodyHtml = await page.evaluate(() => document.body.innerHTML);
      console.log(bodyHtml.substring(0, 2000));
    }
  } catch (e) {
    console.error('TEST SCRIPT ERROR:', e);
  }

  await browser.close();
})();
