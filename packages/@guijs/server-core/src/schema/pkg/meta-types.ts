import { ProjectPackageType } from '@/generated/schema'

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
  projectTypeIds: string[]
}
