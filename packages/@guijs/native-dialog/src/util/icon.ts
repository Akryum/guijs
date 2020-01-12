import path from 'path'
import fs from 'fs-extra'
import os from 'os'
import md5 from 'md5'

const linuxIconsFolder = path.resolve(os.homedir(), '.local/share/icons')

export async function getLinuxIcon (icon: string) {
  // Standard icon
  if (!icon.includes('/')) {
    return {
      iconName: icon,
      clean: null,
    }
  }

  // Copy to ~/.local/share/icons
  fs.ensureDirSync(linuxIconsFolder)
  const iconFile = path.resolve(process.cwd(), icon)
  const extName = path.extname(iconFile)
  const iconName = md5(iconFile)
  const targetIconFile = path.resolve(linuxIconsFolder, iconName + extName)
  await fs.copyFile(iconFile, targetIconFile)

  async function clean () {
    if (fs.existsSync(targetIconFile)) {
      await fs.remove(targetIconFile)
    }
  }

  return {
    iconName,
    clean,
  }
}
