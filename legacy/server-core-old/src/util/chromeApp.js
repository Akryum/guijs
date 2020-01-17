import carlo from 'carlo'
import path from 'path'
import fs from 'fs-extra'

/** @type {carlo.App} */
let app

export async function chromeApp (url) {
  if (!app) {
    const iconPath = path.join(__dirname, `assets/src/assets/app-icon.png`)
    const icon = fs.readFileSync(iconPath)

    app = await carlo.launch({
      icon,
      title: 'guijs',
      args: [
        '--class=guijs',
      ],
    })

    app.serveOrigin(url)
    app.load(url)

    app.on('exit', () => {
      app = null
    })
  } else {
    await app.mainWindow().bringToFront()
  }
}
