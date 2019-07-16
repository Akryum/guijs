/** @typedef {import('../connectors/project-types').ProjectType} ProjectType */

/** @typedef {'general' | 'prompts' | 'select' | 'modal'} StepType */

/** @typedef {(answers: any) => Boolean} StepWhen */

/**
 * @typedef Step
 * @prop {string} id
 * @prop {StepType} type
 * @prop {string} [name]
 * @prop {any} options
 * @prop {StepWhen} [when]
 */

/**
 * @typedef ProjectCreationWizardOptions
 * @prop {string} cwd
 * @prop {ProjectType} type
 */

import prompts from '../connectors/prompts'

export default class ProjectCreationWizard {
  /**
   * @param {ProjectCreationWizardOptions} options
   */
  constructor ({
    cwd,
    type,
  }) {
    this.cwd = cwd
    this.type = type
    /** @type {Step[]} */
    this.steps = [
      {
        id: 'general',
        type: 'general',
        options: {
          prompts: [],
        },
      },
    ]
    /** @type {function[]} */
    this.submitCbs = []
  }

  /**
   * @param {string} id
   */
  getStep (id) {
    return this.steps.find(s => s.id === id)
  }

  extendGeneralStep (options) {
    const generalStep = this.getStep('general')
    if (options.prompts) {
      generalStep.options.prompts.push(...this._withTabId(options.prompts, 'general'))
    }
  }

  /**
   * @param {string} id
   * @param {string} name
   * @param {any} options
   * @param {StepWhen} when
   */
  addStep (id, name, options, when) {
    this._addStep(id, 'prompts', name, options, when)
  }

  /**
   * @param {string} id
   * @param {string} name
   * @param {any} options
   * @param {StepWhen} when
   */
  addSelectStep (id, name, options, when) {
    this._addStep(id, 'select', name, options, when)
  }

  /**
   * @param {string} id
   * @param {string} name
   * @param {any} options
   * @param {StepWhen} when
   */
  addModalStep (id, name, options, when) {
    this._addStep(id, 'modal', name, options, when)
  }

  /**
   * @param {function} cb
   */
  onSubmit (cb) {
    this.submitCbs.push(cb)
  }

  get answers () {
    return prompts.getAnswers()
  }

  /**
   * @param {string} id
   * @param {StepType} type
   * @param {string} name
   * @param {any} options
   * @param {StepWhen} when
   */
  _addStep (id, type, name, options, when = () => true) {
    const step = {
      id,
      type,
      name,
      options,
      when,
    }
    if (options.prompts) {
      step.options.prompts = this._withTabId(step.options.prompts, id)
    }
    this.steps.push(step)
    return step
  }

  _withTabId (prompts, tabId) {
    return prompts.map(p => ({
      ...p,
      tabId,
    }))
  }
}
