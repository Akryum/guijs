import gql from 'graphql-tag'
import { Resolvers, SettingCategory } from '@/generated/schema'
import { MetaSetting } from './meta-types'

export const typeDefs = gql`
type Setting {
  id: ID!
  label: String!
  description: String
  category: SettingCategory!
}

type SettingCategory {
  id: ID!
  label: String!
}

extend type Query {
  settings: [Setting!]!
}
`

const settingCategories: SettingCategory[] = [
  {
    id: 'general',
    label: 'guijs.setting-category.general',
  },
  {
    id: 'display',
    label: 'guijs.setting-category.display',
  },
]

const settings: MetaSetting[] = []

export function addSetting (setting: MetaSetting) {
  settings.push(setting)
}

export const resolvers: Resolvers = {
  Setting: {
    category: (setting) => settingCategories.find(c => c.id === setting.categoryId),
  },

  Query: {
    settings: () => settings,
  },
}
