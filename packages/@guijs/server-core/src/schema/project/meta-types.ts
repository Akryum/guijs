import { ProjectWorkspace, Project } from '@/generated/schema'
import { MetaDocument } from '../db/meta-types'

export interface MetaProject extends MetaDocument, Omit<Project, 'id' | 'workspaces' | 'workspace'> {
  workspaces?: MetaProjectWorkspace[]
}

export interface MetaProjectWorkspace extends Omit<ProjectWorkspace, 'type'> {
  typeId: string
}
