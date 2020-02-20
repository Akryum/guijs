// This is a modified version of the package-getting in bolt
// It supports yarn and lerna workspaces as well, and can fall back through
// several options

import fs from 'fs-extra'
import path from 'path'
import globby from 'globby'
import { PackageJSON } from '@changesets/types'
import { getPackages } from '@lerna/project'

type Options = {
  cwd?: string
  tools?: Array<'yarn' | 'bolt' | 'lerna' | 'root'>
}

export interface Workspace {
  config: PackageJSON
  name: string
  dir: string
  root?: boolean
}

export default async function getWorkspaces (
  opts: Options = {},
): Promise<Array<Workspace> | null> {
  const cwd = opts.cwd || process.cwd()
  const tools = opts.tools || ['yarn', 'bolt', 'lerna', 'root']

  const pkg = await fs.readJson(path.join(cwd, 'package.json'))

  let workspaces

  if (tools.includes('yarn') && pkg.workspaces) {
    if (Array.isArray(pkg.workspaces)) {
      workspaces = pkg.workspaces
    } else if (pkg.workspaces.packages) {
      workspaces = pkg.workspaces.packages
    }
  } else if (tools.includes('bolt') && pkg.bolt && pkg.bolt.workspaces) {
    workspaces = pkg.bolt.workspaces
  }

  if (!workspaces && tools.includes('lerna')) {
    const lernaFile = path.resolve(cwd, 'lerna.json')
    if (fs.existsSync(lernaFile)) {
      const lernaFolders = (await getPackages(cwd)).map(pkg => pkg.location)
      return Promise.all(
        lernaFolders.map(folder => mapWorkspace(cwd, folder, [])),
      )
    }
  }

  if (!workspaces) {
    if (tools.includes('root')) {
      return [{ config: pkg, dir: cwd, name: pkg.name, root: true }]
    }
    return null
  }

  const folders = await globby(workspaces, {
    cwd,
    onlyDirectories: true,
    absolute: true,
    expandDirectories: false,
  })

  const pkgJsonsMissingNameField: Array<string> = []

  const results = await Promise.all(
    folders
      .sort()
      .filter(dir => fs.existsSync(path.join(dir, 'package.json')))
      .map(async dir =>
        mapWorkspace(cwd, dir, pkgJsonsMissingNameField),
      ),
  )
  if (pkgJsonsMissingNameField.length !== 0) {
    pkgJsonsMissingNameField.sort()
    throw new Error(
      `The following package.jsons are missing the 'name' field:\n${pkgJsonsMissingNameField.join(
        '\n',
      )}`,
    )
  }
  return results
}

async function mapWorkspace (cwd: string, dir: string, pkgJsonsMissingNameField: string[]) {
  const config = await fs.readJson(path.join(dir, 'package.json'))
  if (!config.name) {
    pkgJsonsMissingNameField.push(
      path.relative(cwd, path.join(dir, 'package.json')),
    )
  }
  return { config, name: config.name, dir }
}
