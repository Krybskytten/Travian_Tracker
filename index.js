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

  fs.writeFile('./tracker.json', JSON.stringify
  ({ 
      Tribe:`${profileData[0]}`,
      Alliance: `${profileData[1]}`,
      Villages: `${profileData[2]}`, 
      Population_rank: `${profileData[3]}`,
      Attacker_rank: `${profileData[4]}`,
      Defender_rank: `${profileData[5]}`,
      Hero_level: `${profileData[6]}`
    }, null, 7)); 


/* TROOPS IN SELECTED VILLAGE */
const page3 = await browser.newPage();
  await page3.goto(`${config.domain}/build.php?gid=16&tt=1&filter=3`)
  await page3.setViewport({width: 1920, height: 1080});
  const troopData = await page3.evaluate(() => {
  const tds = Array.from(document.getElementsByClassName("units last"))
return tds.map(td => td.textContent)
    });
console.log(troopData[0])
    if (`${profileData[0]}`== `Gauls`) {
        fs.writeFile('./troops.json', JSON.stringify
        ({ 
        TroopData: `${troopData[0]}`
            /*    
        Phalanx:`${troopData[0]}`,
            Swordsman: `${troopData[1]}`,
            Pathfinder: `${troopData[2]}`, 
            Theutates_thunder: `${troopData[3]}`,
            Druidrider: `${troopData[4]}`,
            Haeduan: `${troopData[5]}`,
            Ram: `${troopData[6]}`,
            Trebuchet: `${troopData[7]}`,
            Chieftain: `${troopData[8]}`,
            Settler: `${troopData[9]}`,
            Hero: `${troopData[10]}`, */
          }, null, 11)); 
    } else if (`${profileData[0]}`== `Romans`) {
console.log("fix and then add later.")
    } else { (`${profileData[0]}`== `Teutons`) 
    console.log("fix and then add later.")

    };
    


  /* PROCESS DONE */
  await browser.close();

} 



main();



