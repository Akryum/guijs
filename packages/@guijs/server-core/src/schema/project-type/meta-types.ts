import { ProjectGenerator } from '@/generated/schema'
import { values } from 'faunadb'

export interface MetaProjectGenerator extends Omit<ProjectGenerator, 'projectType'> {
  projectType: values.Ref
  module?: string
}
