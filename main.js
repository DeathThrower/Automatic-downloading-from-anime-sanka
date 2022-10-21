const {chromium} = require('playwright')
const robot = require('robotjs')


async function download_file(url,page) {
    start_down = [758,508]; // the x and x coordinates of start download button in idm
    minTotray = [894,208];  // the x and x coordinates of minimize to system tray button in idm
    try {
        await page.goto(url);
        let selector = '#uc-download-link'
        const [download] = await Promise.all([
            page.waitForSelector(selector),
            page.locator(selector).click()
        ])
        robot.moveMouse(start_down[0],start_down[1]);
        robot.mouseClick();
        robot.setMouseDelay(300)
        robot.moveMouse(minTotray[0],minTotray[1]);
        robot.mouseClick();
        return page.waitForTimeout(10);
    } catch {
        robot.setMouseDelay(300)
        robot.moveMouse(start_down[0],start_down[1]);
        robot.mouseClick();
        robot.setMouseDelay(300)
        robot.moveMouse(minTotray[0],minTotray[1]);
        robot.mouseClick();
        return page.waitForTimeout(1000);
    }
    return page.waitForTimeout(1000);
}

async function scrape_download(html,page){
    let start,end;
    start = html.indexOf('GOOGLEDRIVE-EP-')+15;
    end = html.indexOf('@',start);
    n_epi = parseInt(html.substring(start,end));
    let j = 995
    for (i=j; i< j+10; i++){
        start = html.indexOf(`GOOGLEDRIVE-EP-${i}@`);
        start = start+16+ String(i).length;
        end = html.indexOf("export=download",start);
        end = end+15;
        link = html.substring(start,end);
        await download_file(link,page)
    }
    return page.close()
}

async function get_html(url) {
    const ud_dir = 'C:\\Users\\Asus\\AppData\\Local\\Google\\Chrome\\User Data'
    const browser = await chromium.launchPersistentContext(ud_dir,{
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        //downloadsPath: download_dir,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: [`--start-maximized`]
    })
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(url);
    const html = await page.evaluate(() => {
        const tds = document.getElementsByTagName('select')[0].innerHTML;
        return tds
    });
    await scrape_download(html,page)
    browser.close()
}

function create_dir(dir){
    const fs = require('fs');
    const folderName = dir;
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
    } 
}

function mouse(x,y){
    robot.setMouseDelay(100)
    robot.moveMouse(x,y)
    robot.mouseClick()
}

function change_download_dir(url){
    let start = url.lastIndexOf('/')+1;
    let end = url.lastIndexOf('.');
    const anime = url.substring(start,end).replace('-',' ');
    let dir = 'D:\\anime and movies\\' + anime;
    //let dir = 'D:\\anime and movies\\Kimi ni Todoke S2'
    create_dir(dir);
    m1 = [258,847]
    m2 = [798,182]
    m3 = [876,215]
    m4 = [912,320]
    m5 = [910,404]
    m6 = [1047,424]
    m7 = [934,233]
    m8 = [1074,631]
    m9 = [1103,167]
    m10 = [1284,116]
    mouse(...m1)
    robot.typeString(" idm")
    robot.keyTap("enter");
    robot.setMouseDelay(100)
    mouse(...m2)
    mouse(...m3)
    mouse(...m4)
    mouse(...m5)
    mouse(...m6)
    mouse(...m7)
    robot.setKeyboardDelay(500)
    robot.keyTap("backspace")
    robot.typeString(dir)
    robot.keyTap("enter")
    mouse(...m8)
    mouse(...m9)
    mouse(...m10)
    //return Promise()
}
  
const url = 'https://sanka.animesanka.xyz/https://watch.animesanka.com/2019/12/one-piece.html';

async function func(){
    //change_download_dir(url)
    get_html(url)
}

func()