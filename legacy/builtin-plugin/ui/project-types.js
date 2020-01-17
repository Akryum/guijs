const fs = require('fs-extra')
const path = require('path')

const gitignore = `node_modules
.DS_Store
design
*.log
packages/test
dist
temp
.version
.versions
.changelog
`

const readme = (answers) => `# ${answers.projectName}

${answers.pkg.description}
`

module.exports = api => {
  api.addProjectType('unknown', 'JavaScript', projectType => {
    projectType.logo = '/public/js-logo.png'
    projectType.description = `Minimal JS project`

    // Project creation
    projectType.onCreate(onCreate)
  })
}

function onCreate ({ wizard }) {
  wizard.extendGeneralStep({
    prompts: [
      {
        name: 'force',
        type: 'confirm',
        message: 'Overwrite target directory if it exists',
      },
      {
        name: 'pkg.description',
        type: 'input',
        message: 'Description',
      },
      {
        name: 'pkg.version',
        type: 'input',
        message: 'Version',
        default: '0.0.0',
      },
      {
        name: 'pkg.author',
        type: 'input',
        message: 'Author',
      },
      {
        name: 'pkg.license',
        type: 'input',
        message: 'License',
      },
    ],
  })

  wizard.onSubmit(async ({
    cwd,
    answers,
    setProgress,
  }) => {
    setProgress({
      info: 'Generating files...',
    })
    const projectPath = path.resolve(cwd, answers.projectName)

    // Clean
    if (fs.existsSync(projectPath)) {
      if (answers.force) {
        await fs.remove(projectPath)
      } else {
        throw new Error(`Folder ${projectPath} already exists`)
      }
    }

    await fs.ensureDir(projectPath)
    await fs.ensureDir(path.join(projectPath, 'node_modules'))
    await fs.writeJson(path.join(projectPath, 'package.json'), {
      name: answers.projectName,
      ...answers.pkg,
      private: true,
      main: './index.js',
    }, {
      spaces: 2,
    })
    await fs.writeFile(path.join(projectPath, 'index.js'), `console.log('Hello world')`, {
      encoding: 'utf8',
    })
    await fs.writeFile(path.join(projectPath, 'README.md'), readme(answers), {
      encoding: 'utf8',
    })
    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore, {
      encoding: 'utf8',
    })
  })
}
