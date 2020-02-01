import { ProjectPackageType } from '@/generated/schema'
import { values } from 'faunadb'

export interface MetaProjectPackage {
  id: string
  type: ProjectPackageType
  versionSelector: string
  metadata?: MetaPackage
  isWorkspace?: boolean
}

export interface MetaPackage {
  id: string
  name: string
  version: string
  projectTypeIds: string[]
  official: boolean
  description: string
  defaultLogo: string
}

export interface FaunaPackage {
  id: string
  name: string
  projectTypes: values.Ref[]
  tags: string[]
  description: string
  avatar: string
}
