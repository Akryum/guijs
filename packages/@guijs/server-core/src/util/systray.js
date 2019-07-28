import SysTray from 'systray'
import fs from 'fs-extra'
import path from 'path'
import { isWindows } from '@nodepack/utils'
import { openBrowser } from '@nodepack/utils/src/openBrowser'

const iconPath = path.join(__dirname, `../src/assets/logo.${isWindows ? 'ico' : 'png'}`)
const iconBuffer = fs.readFileSync(iconPath)
const icon = iconBuffer.toString('base64')

const OPEN_ITEM = {
  title: 'Open',
  enabled: true,
}

const ABOUT_ITEM = {
  title: 'About (website)',
  enabled: true,
}

const EXIT_ITEM = {
  title: 'Exit',
  enabled: true,
}

const config = {
  menu: {
    icon,
    tooltip: `guijs`,
    items: [
      {
        title: 'guijs',
      },
      OPEN_ITEM,
      ABOUT_ITEM,
      EXIT_ITEM,
    ],
  },
  debug: false,
}

export function createSystrayMenu ({
  openApp,
}) {
  const systray = new SysTray(config)

  systray.onClick(action => {
    // Open
    if (action.seq_id === config.menu.items.indexOf(OPEN_ITEM)) {
      openApp()
    }

    // About
    if (action.seq_id === config.menu.items.indexOf(ABOUT_ITEM)) {
      openBrowser(`https://guijs.dev`)
    }

    // Exit
    if (action.seq_id === config.menu.items.indexOf(EXIT_ITEM)) {
      process.exit(0)
    }
  })
}
