import Context from '@/generated/context'

export interface ProjectGeneratorAPIOptions {
  projectName: string
  baseFolder: string
  projectPath: string
}

interface Requirement {
  name: string
  checkHandler: () => Promise<boolean> | boolean
  installHandler: () => Promise<void> | void
}

type GenerateHandler = () => Promise<void> | void

export class ProjectGeneratorAPI<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TCustomOptions = any
> {
  options: ProjectGeneratorAPIOptions
  customOptions: TCustomOptions
  context: Context

  /**
   * @private
   */
  requirementCheckHandlers: Requirement[] = []
  /**
   * @private
   */
  generateHandlers: GenerateHandler[] = []

  constructor (options: ProjectGeneratorAPIOptions, context: Context) {
    this.options = options
    this.context = context
    this.customOptions = {} as TCustomOptions
  }

  addRequirement (
    name: string,
    checkHandler: Requirement['checkHandler'],
    installHandler: Requirement['installHandler'],
  ) {
    this.requirementCheckHandlers.push({
      name,
      checkHandler,
      installHandler,
    })
  }

  onGenerate (handler: GenerateHandler) {
    this.generateHandlers.push(handler)
  }
}
