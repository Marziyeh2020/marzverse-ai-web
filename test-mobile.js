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
    
    // Check if body is empty or black
    const content = await page.content();
    if (content.includes('MARZVERSE')) {
      console.log('RESULT: PAGE RENDERED');
    } else {
      console.log('RESULT: PAGE NOT RENDERED. Checking HTML dump:');
      console.log(content.substring(0, 1000));
    }
  } catch (e) {
    console.error('TEST SCRIPT ERROR:', e);
  }

  await browser.close();
})();
