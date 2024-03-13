## Source Code Moec TS

> *Read This*
> Before you start development, this project are not well structured that's mean there has code with iduno what's used for and this project are not well finised. I was to lazy for creating documentation about this project so up to you

## Setup Enviroment
Before you begin make sure your enviroment has been setup. This project required:
- NodeJS (>=18)
- Typescript Compiler (>= 5.3)
- pm2 (For process manager)

Let's start begin

First you need install all dependencies with your package manager, so for example i'm using yarn for package manager so i just run yarn or yarn install it's will automatically installed all dependencies
If you have beed finished you can run yarn build or npm run build for building this project and use pm2 for run this project
> Note:
> Please use cron restart from pm2 for automatically restarted beacuse this project are not automatically restarted if reached 2hours by default so use pm2 as required on top with command pm2 start build/index.js --cron-restart="0 */2 * * *" and make sure you have been installed pm2 as global package

This project uses Apache 2.0 license you can read [here.](LICENSE)