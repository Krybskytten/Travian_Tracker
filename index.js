/** ⚠️ Disclaimer⚠️ **/
/** This software is for educational purposes only. Do not risk accounts which you are afraid to lose. 
 ** USE THE SOFTWARE AT YOUR OWN RISK. THE AUTHORS AND ALL AFFILIATES ASSUME NO RESPONSIBILITY FOR ANY SANCTIONS MADE TO YOUR TRAVIAN ACCOUNT.  
**/

const config = require ("./config.json");

const puppeteer = require('puppeteer');
const fs = require('fs-extra');

let username = config.travian_username;
let password = config.travian_password;
let domain = config.domain;
let plus_account = config["plus_account?"];

if (!username) return console.log("You haven't set your username in the config.json file!")
if (!password) return console.log("You haven't set your password in the config.json file!")
if (!domain) return console.log("You haven't set your domain in the config.json file!")
if (!plus_account) return console.log(`Are you using a plus account? type "yes" in the config.json file. If not, you should write "no". 
Feel free to check this example of how to set up your config: https://github.com/Krybskytten/Travian_Tracker#config-example`)

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
console.log("Successfully loaded profileData")
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
  await page3.goto(`${config.domain}/village/statistics/troops`)
  await page3.setViewport({width: 1920, height: 1080});
  const plusTroopData = await page3.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('table tr td'))
    return tds.map(td => td.innerText)
  }); 
  console.log("Successfully loaded plusTroopData")

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
  console.log("You don't have plus on your account. Skipping scan of plusTroopData...")
  console.log("Successfully loaded troopData")
  
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
/* RESSOURCES */
if (`${config["plus_account?"]}` == `yes`) {
  const page5 = await browser.newPage();
   await page5.goto(`${config.domain}/village/statistics/resources`)
   await page5.setViewport({width: 1920, height: 1080});
   const ressourceData = await page5.evaluate(() => {
     const tds = Array.from(document.querySelectorAll('table tr td'))
     return tds.map(td => td.innerText)
   }); 
  console.log("Successfully loaded ressourceData")
 fs.writeFile('./data/ressources.json', JSON.stringify
 ({ 
       Wood: `${ressourceData[14]}`,
       Clay: `${ressourceData[15]}`,
       Iron: `${ressourceData[16]}`, 
       Crop: `${ressourceData[17]}`,
       Merchants: `${ressourceData[18]}`,
   }, null, 5)); 
 
 } else {
   /* SKIPPING RESSOURCES */
console.log("You don't have plus on your account. Skipping scan of ressources...")
fs.writeFile('./data/ressources.json', JSON.stringify
 ({ 
       Wood: `?`,
       Clay: `?`,
       Iron: `?`, 
       Crop: `?`,
       Merchants: `?`,
   }, null, 5)); 
 };
/* CULTURE POINTS  */
 if (`${config["plus_account?"]}` == `yes`) {
  const page6 = await browser.newPage();
   await page6.goto(`${config.domain}/village/statistics/culturepoints`)
   await page6.setViewport({width: 1920, height: 1080});
   const cultureData = await page6.evaluate(() => {
     const tds = Array.from(document.querySelectorAll('table tr td'))
     return tds.map(td => td.innerText)
   }); 
  console.log("Successfully loaded cultureData")
 fs.writeFile('./data/culturepoints.json', JSON.stringify
 ({ 
       CPsPerDay: `${cultureData[12]}`,
       Celebrations: `${cultureData[13]}`,
       Troops: `${cultureData[14]}`, 
       Slots: `${cultureData[15]}`,
   }, null, 4)); 
 
 } else {
  /* SKIPPING CULTURE POINTS  */
console.log("You don't have plus on your account. Skipping scan of culture points...")
fs.writeFile('./data/culturepoints.json', JSON.stringify
 ({ 
       CPsPerDay: `?`,
       Celebrations: `?`,
       Troops: `?`, 
       Slots: `?`,
   }, null, 4)); 
 };

  /* PROCESS DONE */
  console.log("Script successfully executed. Close the terminal now.")
  await browser.close();

} 
main();