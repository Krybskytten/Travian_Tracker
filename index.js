/** ⚠️ Disclaimer⚠️ **/
/** This software is for educational purposes only. Do not risk accounts which you are afraid to lose. 
 ** USE THE SOFTWARE AT YOUR OWN RISK. THE AUTHORS AND ALL AFFILIATES ASSUME NO RESPONSIBILITY FOR YOUR SANCTIONS MADE TO YOUR ACCOUNT.  
**/


const config = require ("./config.json");
const puppeteer = require('puppeteer');


/* AUTHORIZATION */
async function main() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  await page.goto(`${config.domain}/login.php`, { waitUntil: 'networkidle0' }); // wait until page load
  await page.type('#content > div > div.innerLoginBox > form > table > tbody > tr.account > td:nth-child(2) > input', `${config.travian_username}`);
  await page.type('#content > div > div.innerLoginBox > form > table > tbody > tr.pass > td:nth-child(2) > input', `${config.travian_password}`);
  await Promise.all([
    page.click('#s1'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    console.log(`Logged in as ${config.travian_username} on ${config.domain}`)


]);
/* PLAYER DETAILS */

const page2 = await browser.newPage();
  await page2.goto(`${config.domain}/profile`)
  await page.setViewport({width: 1920, height: 1080});
  const data = await page2.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('table tr td'))
    return tds.map(td => td.innerText)
  });

  console.log(`Tribe: ${data[0]}`);
  if (data[1] == `-`) {
      console.log("Alliance: None")
  } else {
    console.log(`Alliance: ${data[1]}`);
  }
  console.log(`Villages: ${data[2]}`);
  console.log(`Population rank: ${data[3]}`);
  console.log(`Attacker rank: ${data[4]}`);
  console.log(`Defender rank: ${data[5]}`);
  console.log(`Hero level: ${data[6]}`);

/* PROCESS DONE */
  await browser.close();

} 


main();



