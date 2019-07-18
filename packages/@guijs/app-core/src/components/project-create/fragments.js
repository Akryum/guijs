import gql from 'graphql-tag'
import prompt from '@/graphql/prompt/promptFragment.gql'

export const projectCreationWizard = gql`
fragment projectCreationWizard on ProjectCreationWizard {
  type {
    id
    logo
    name
  }
  steps {
    id
    type
    name
    enabled
    icon
    description
    prompts {
      ...prompt
    }
    canSkip
  }
}
${prompt}
`
