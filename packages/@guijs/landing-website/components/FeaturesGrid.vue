<script>
import FeatureItem from './FeatureItem.vue'

export default {
  components: {
    FeatureItem,
  },
}
</script>

<template>
  <div class="flex flex-col items-center">
    <h2 class="text-orange-500 text-2xl mb-8">
      Features
    </h2>

    <div class="features">
      <FeatureItem
        title="Project manager"
      >
        Create and manager all your JS projects
      </FeatureItem>

      <FeatureItem
        title="Packages"
      >
        Install and update your packages
      </FeatureItem>

      <FeatureItem
        title="Integrate your tools"
      >
        guijs integrates with an expanding set of JS tools
      </FeatureItem>

      <FeatureItem
        title="Run Scripts"
      >
        Run scripts with visual enhancements like a webpack dashboard
      </FeatureItem>

      <FeatureItem
        title="Manage Scripts"
      >
        Create and edit scripts with a powerful command editor
      </FeatureItem>

      <FeatureItem
        title="Visual configuration"
      >
        Configuration screens help you setup your favorite tools
      </FeatureItem>

      <FeatureItem
        title="Monorepo support"
      >
        Create mono-repositories and manage your workspaces
      </FeatureItem>

      <FeatureItem
        title="Keyboard shortcuts"
      >
        Be more productive with comprehensive keybindings and a command palette
      </FeatureItem>

      <FeatureItem
        title="Plugins"
      >
        Extend guijs with plugins - the possibilities are endless!
      </FeatureItem>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: theme('spacing.8');
  align-items: stretch;
  justify-items: center;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
}
</style>
