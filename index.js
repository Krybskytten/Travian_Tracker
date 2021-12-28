/** ⚠️ Disclaimer⚠️ **/
/** This software is for educational purposes only. Do not risk accounts which you are afraid to lose. 
 ** USE THE SOFTWARE AT YOUR OWN RISK. THE AUTHORS AND ALL AFFILIATES ASSUME NO RESPONSIBILITY FOR YOUR SANCTIONS MADE TO YOUR ACCOUNT.  
**/

const config = require ("./config.json");

const puppeteer = require('puppeteer');
const fs = require('fs-extra');


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
  await page2.setViewport({width: 1920, height: 1080});
  const profileData = await page2.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('table tr td'))
    return tds.map(td => td.innerText)
  });

  fs.writeFile('./data/general.json', JSON.stringify
  ({ 
      Tribe:`${profileData[0]}`,
      Alliance: `${profileData[1]}`,
      Villages: `${profileData[2]}`, 
      Population_rank: `${profileData[3]}`,
      Attacker_rank: `${profileData[4]}`,
      Defender_rank: `${profileData[5]}`,
      Hero_level: `${profileData[6]}`
    }, null, 7)); 
  
/* TROOPS IN ALL VILLAGES */
if (`${config["plus_account?"]}` == `yes`) {
 const page3 = await browser.newPage();
  await page3.goto(`${config.domain}village/statistics/troops`)
  await page3.setViewport({width: 1920, height: 1080});
  const plusTroopData = await page3.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('table tr td'))
    return tds.map(td => td.innerText)
    
  }); 

fs.writeFile('./data/troops.json', JSON.stringify
({ 
      Infantry_1: `${plusTroopData[25]}`,
      Infantry_2: `${plusTroopData[26]}`,
      Infantry_3: `${plusTroopData[27]}`, 
      Horse_1: `${plusTroopData[28]}`,
      Horse_2: `${plusTroopData[29]}`,
      Horse_3: `${plusTroopData[30]}`,
      Ram: `${plusTroopData[31]}`,
      Catapult: `${plusTroopData[32]}`,
      Chief: `${plusTroopData[33]}`,
      Settler: `${plusTroopData[34]}`,
      Hero: `${plusTroopData[35]}`,
  }, null, 11)); 

} else {
  /* TROOPS IN SELECTED VILLAGE */
  const page4 = await browser.newPage();
  await page4.goto(`${config.domain}/build.php?gid=16&tt=1&filter=3`)
  await page4.setViewport({width: 1920, height: 1080});
  const troopData = await page4.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('table tr td'))
    return tds.map(td => td.innerText)
  });
  
  fs.writeFile('./data/troops.json', JSON.stringify
({ 
      Infantry_1: `${troopData[13]}`,
      Infantry_2: `${troopData[14]}`,
      Infantry_3: `${troopData[15]}`, 
      Horse_1: `${troopData[16]}`,
      Horse_2: `${troopData[17]}`,
      Horse_3: `${troopData[18]}`,
      Ram: `${troopData[19]}`,
      Catapult: `${troopData[20]}`,
      Chief: `${troopData[21]}`,
      Settler: `${troopData[22]}`,
      Hero: `${troopData[23]}`,
  }, null, 11)); 
};
  /* PROCESS DONE */
  await browser.close();

} 
main();