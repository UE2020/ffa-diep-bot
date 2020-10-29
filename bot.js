// puppeteer is used to create a headless chromium instance
const puppeteer = require('puppeteer');
const ImageParser = require('./image');
const botutil = require('./util');

// Bot class that spawns a bot with a url
class Bot {
    constructor(url = 'https://diep.io', fps = 60) {
        this.fps = 1000 / fps;
        this.connect(url);
    }

    // create puppeteer instance
    async connect(url) {
        // go to diep.io and set the viewport
        this.browser = await puppeteer.launch({ headless: true });
        this.page = await this.browser.newPage();
        // set user agent to make sure that diep.io isn't sus.
        await this.page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
        await this.page.goto(url);
        this.page.setViewport({ width: 320, height: 320, deviceScaleFactor: 0.5 });

        // level up
        this.page.keyboard.down('KeyK');


        // mainloops
        setInterval(this.update, this.fps, this);
        setInterval(async () => {
            // upgrade stats and enter the game
            this.page.keyboard.down('KeyK');
            await this.page.keyboard.press('Digit4');
            await this.page.keyboard.press('Digit5');
            await this.page.keyboard.press('Digit6');
            await this.page.keyboard.press('Digit7');
            await this.page.keyboard.press('Digit8');
            
            await this.page.keyboard.press('Enter');
        }, 1000)
    }

    // mainloop
    async update(self) {
        let screenData = await self.page.screenshot({path: "image.png"});
        await self.page.keyboard.press('Backslash');
        let imageParser = new ImageParser(screenData);
        self.page.mouse.down();
        let matches = imageParser.getEveryPixelWithColor('#f14e54');


        if (matches.length != 0) {
            // find the nearest tank
            // this algorithm is used in maxtri-bot
            matches.sort(function (a, b) {
                let aDistance = botutil.distance(a, [imageParser.width/2, imageParser.width/2]);
                let bDistance = botutil.distance(b, [imageParser.height/2, imageParser.height/2]);

                return bDistance - aDistance;
            });

            // move towards the nearest tank
            let matrix = [0, 0, 0, 0] // look familiar? this algorithm is from AntiTeam
            if (matches[0][0] < imageParser.width/2) matrix[3] = 1;
            if (matches[0][0] > imageParser.width/2) matrix[1] = 1;
            if (matches[0][1] < imageParser.height/2) matrix[2] = 1;
            if (matches[0][1] > imageParser.height/2) matrix[0] = 1;
            self.setMovement(...matrix);

            // point 
            self.page.mouse.move(matches[0][0], matches[0][1]);
            
        } else {
            let squares = imageParser.getEveryPixelWithColor('#FFE869');
            if (squares.length === 0) return;
            squares.sort(function (a, b) {
                let aDistance = botutil.distance(a, [imageParser.width/2, imageParser.width/2]);
                let bDistance = botutil.distance(b, [imageParser.height/2, imageParser.height/2]);

                return aDistance - bDistance;
            });

            // move towards the nearest tank
            let matrix = [0, 0, 0, 0] // look familiar? this algorithm is from AntiTeam
            if (squares[0][0] > imageParser.width/2) matrix[3] = 1;
            if (squares[0][0] < imageParser.width/2) matrix[1] = 1;
            if (squares[0][1] > imageParser.height/2) matrix[2] = 1;
            if (squares[0][1] < imageParser.height/2) matrix[0] = 1;
            self.setMovement(...matrix);

            // point 
            self.page.mouse.move(squares[0][0], squares[0][1]);
        }

        //matches = imageParser.getEveryPixelWithColor('#94FAF6');
        //if (matches.length != 0) {
        //    await self.page.mouse.up();
         //   await self.page.mouse.click(matches[0][0], matches[0][1]);
        //}
    }

    // set the movement of the bot
    setMovement(w, a, s, d) {
        // clear all movement
        this.page.keyboard.up('KeyW');
        this.page.keyboard.up('KeyA');
        this.page.keyboard.up('KeyS');
        this.page.keyboard.up('KeyD');

        // press
        if (w) this.page.keyboard.down('KeyW');
        if (a) this.page.keyboard.down('KeyA');
        if (s) this.page.keyboard.down('KeyS');
        if (d) this.page.keyboard.down('KeyD');
    }
}

// initialize bot(s)
new Bot('https://diep.io');
