import { ProjectWorkspace, Project } from '@/generated/schema'
import { MetaDocument } from '../db/meta-types'

export interface MetaProject extends MetaDocument, Omit<Project, 'id' | 'workspaces'> {
}

export interface MetaProjectWorkspace extends Omit<ProjectWorkspace, 'type'> {
  typeId: string
}
