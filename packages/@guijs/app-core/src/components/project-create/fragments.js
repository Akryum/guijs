import gql from 'graphql-tag'
import prompt from '@/graphql/prompt/promptFragment.gql'

export const projectCreationWizard = gql`
fragment projectCreationWizard on ProjectCreationWizard {
  steps {
    id
    type
    name
    enabled
    prompts {
      ...prompt
    }
  }
}
${prompt}
`
