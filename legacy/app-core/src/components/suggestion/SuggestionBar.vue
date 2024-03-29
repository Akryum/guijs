<template>
  <ApolloQuery
    :query="require('@/graphql/suggestion/suggestions.gql')"
    class="suggestion-bar"
  >
    <ApolloSubscribeToMore
      :document="require('@/graphql/suggestion/suggestionAdded.gql')"
      :update-query="(previousResult, { subscriptionData }) => {
        const newSuggestion = subscriptionData.data.suggestionAdded
        if (!previousResult.suggestions) {
          return {
            suggestions: [newSuggestion]
          }
        }
        if (previousResult.suggestions.find(s => s.id === newSuggestion.id)) {
          return previousResult
        }
        return {
          suggestions: [
            ...previousResult.suggestions,
            newSuggestion
          ]
        }
      }"
    />

    <ApolloSubscribeToMore
      :document="require('@/graphql/suggestion/suggestionUpdated.gql')"
    />

    <ApolloSubscribeToMore
      :document="require('@/graphql/suggestion/suggestionRemoved.gql')"
      :update-query="(previousResult, { subscriptionData }) => ({
        suggestions: previousResult.suggestions ? previousResult.suggestions.filter(
          s => s.id !== subscriptionData.data.suggestionRemoved.id
        ) : []
      })"
    />

    <template
      v-if="data"
      slot-scope="{ result: { data } }"
    >
      <SuggestionBarList
        :suggestions="withBuiltins(data.suggestions)"
      />
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  data () {
    return {
      forceDevtoolsSuggestion: false,
    }
  },
  methods: {
    // Builtin suggestions
    withBuiltins (suggestions) {
      let list = suggestions

      // Install devtools
      if (this.forceDevtoolsSuggestion || !Object.prototype.hasOwnProperty.call(window, '__VUE_DEVTOOLS_GLOBAL_HOOK__')) {
        let devtoolsLink = null
        if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
          devtoolsLink = 'https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd'
        } else if (/Firefox/.test(navigator.userAgent)) {
          devtoolsLink = 'https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/'
        }

        if (devtoolsLink) {
          list = [
            ...list,
            {
              id: 'vue-devtools',
              type: 'action',
              label: 'org.vue.cli-service.suggestions.vue-devtools.label',
              message: 'org.vue.cli-service.suggestions.vue-devtools.message',
              link: 'https://github.com/vuejs/vue-devtools',
              image: 'https://raw.githubusercontent.com/vuejs/vue-devtools/master/media/screenshot.png',
              actionLink: devtoolsLink,
            },
          ]
        }
      }

      return list
    },
  },
}
</script>

<style lang="stylus" scoped>
.suggestions
  h-box()
</style>
