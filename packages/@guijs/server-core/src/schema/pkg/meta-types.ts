import { ProjectPackageType } from '@/generated/schema'
import { values } from 'faunadb'

export interface MetaProjectPackage {
  id: string
  type: ProjectPackageType
  versionSelector: string
  metadata?: MetaPackageMetadata
  isWorkspace?: boolean
  workspaceId: string
}

export interface MetaPackageMetadata {
  id: string
  awesomejsId?: string
  cacheVersion?: string
  projectTypeIds: string[]
  official?: boolean
  description: string
  defaultLogo?: string
}

export interface FaunaPackage {
  id: string
  name: string
  projectTypes: values.Ref[]
  tags: string[]
  description: string
  avatar: string
}
