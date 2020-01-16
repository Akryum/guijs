import gql from 'graphql-tag'
import fs from 'fs-extra'
import { withFilter } from 'apollo-server-express'
import { Resolvers, SettingCategory } from '@/generated/schema'
import { MetaSetting } from './meta-types'
import { getRcFile } from '@/util/rc-folder'
import Context from '@/generated/context'

export const typeDefs = gql`
type Setting {
  id: ID!
  label: String!
  description: String
  category: SettingCategory!
  value: JSON
}

type SettingCategory {
  id: ID!
  label: String!
}

extend type Query {
  settings: [Setting!]!
  setting (id: ID!): Setting
}

extend type Mutation {
  updateSetting (input: UpdateSettingInput!): Setting
}

input UpdateSettingInput {
  id: ID!
  value: JSON
}

extend type Subscription {
  settingUpdated (id: ID!): Setting
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

const settingsFile = getRcFile('settings.json')
if (!fs.existsSync(settingsFile)) {
  fs.writeJsonSync(settingsFile, {})
}
const currentSettings: { [key: string]: any } = fs.readJsonSync(settingsFile)

export async function updateSetting (
  id: string,
  value: any,
  ctx: Context,
) {
  const setting = settings.find(s => s.id === id)
  if (!setting) {
    throw new Error(`Setting ${id} not found`)
  }
  currentSettings[id] = value
  ctx.pubsub.publish('settingUpdated', {
    settingUpdated: setting,
  })
  await fs.writeJson(settingsFile, currentSettings)
  return setting
}

export const resolvers: Resolvers = {
  Setting: {
    category: (setting) => settingCategories.find(c => c.id === setting.categoryId),
    value: (setting) => currentSettings[setting.id] || setting.defaultValue,
  },

  Query: {
    settings: () => settings,
    setting: (root, { id }) => settings.find(s => s.id === id),
  },

  Mutation: {
    updateSetting: async (root, { input }, ctx) => updateSetting(input.id, input.value, ctx),
  },

  Subscription: {
    settingUpdated: {
      subscribe: withFilter(
        (root, args, ctx) => ctx.pubsub.asyncIterator(['settingUpdated']),
        (payload, variables, context: Context) => payload.settingUpdated.id === variables.id,
      ),
    },
  },
}
