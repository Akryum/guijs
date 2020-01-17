import { getFixturePath } from 'jest-fixtures'
import getWorkspaces from '../src/'

describe('get-workspaces', () => {
  it('should resolve yarn workspaces if the yarn option is passed', async () => {
    const cwd = await getFixturePath(__dirname, 'yarn-workspace-base')
    const workspaces = await getWorkspaces({ cwd, tools: ['yarn'] })
    if (workspaces === null) {
      return expect(workspaces).not.toBeNull()
    }
    expect(workspaces[0].name).toEqual('yarn-workspace-base-pkg-a')
    expect(workspaces[1].name).toEqual('yarn-workspace-base-pkg-b')
  })
  it('should resolve yarn workspaces if the yarn option is passed and packages field is used', async () => {
    const cwd = await getFixturePath(__dirname, 'yarn-workspace-packages')
    const workspaces = await getWorkspaces({ cwd, tools: ['yarn'] })
    if (workspaces === null) {
      return expect(workspaces).not.toBeNull()
    }
    expect(workspaces[0].name).toEqual('yarn-workspace-package-pkg-a')
    expect(workspaces[1].name).toEqual('yarn-workspace-package-pkg-b')
  })
  it('should resolve bolt workspaces if the bolt option is passed', async () => {
    const cwd = await getFixturePath(__dirname, 'bolt-workspace')
    const workspaces = await getWorkspaces({ cwd, tools: ['bolt'] })
    if (workspaces === null) {
      return expect(workspaces).not.toBeNull()
    }
    expect(workspaces[0].name).toEqual('bolt-workspace-pkg-a')
    expect(workspaces[1].name).toEqual('bolt-workspace-pkg-b')
  })
  it('should resolve main package if root option is passed', async () => {
    const cwd = await getFixturePath(__dirname, 'root-only')
    const workspaces = await getWorkspaces({ cwd, tools: ['root'] })
    if (workspaces === null) {
      return expect(workspaces).not.toBeNull()
    }
    expect(workspaces.length).toEqual(1)
    expect(workspaces[0].dir).toEqual(cwd)
  })
  it('should by default resolve yarn workspaces', async () => {
    const cwd = await getFixturePath(__dirname, 'yarn-workspace-base')
    const workspaces = await getWorkspaces({ cwd })
    if (workspaces === null) {
      return expect(workspaces).not.toBeNull()
    }
    expect(workspaces[0].name).toEqual('yarn-workspace-base-pkg-a')
    expect(workspaces[1].name).toEqual('yarn-workspace-base-pkg-b')
  })
  it('should by default resolve bolt workspaces if yarn workspaces are absent', async () => {
    const cwd = await getFixturePath(__dirname, 'bolt-workspace')
    const workspaces = await getWorkspaces({ cwd })
    if (workspaces === null) {
      return expect(workspaces).not.toBeNull()
    }
    expect(workspaces[0].name).toEqual('bolt-workspace-pkg-a')
    expect(workspaces[1].name).toEqual('bolt-workspace-pkg-b')
  })
  it('should return an empty array if no workspaces are found', async () => {
    const cwd = await getFixturePath(__dirname, 'root-only')
    const workspaces = await getWorkspaces({ cwd })
    expect(workspaces).toEqual(null)
  })

  it('should throw an error if a package.json is missing the name field', async () => {
    const cwd = await getFixturePath(__dirname, 'no-name-field')
    try {
      await getWorkspaces({ cwd })
    } catch (err) {
      expect(err.message).toBe(
        'The following package.jsons are missing the "name" field:\npackages/pkg-a/package.json\npackages/pkg-b/package.json'
      )
      return
    }
    expect(true).toBe(false)
  })
})
