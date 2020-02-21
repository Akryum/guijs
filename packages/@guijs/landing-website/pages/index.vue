<script>
import DownloadButton from '~/components/DownloadButton.vue'
import FeaturesGrid from '~/components/FeaturesGrid.vue'
import HeroIntegration from '~/components/HeroIntegration.vue'
import HeroScreenshot from '~/components/HeroScreenshot.vue'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    DownloadButton,
    FeaturesGrid,
    HeroIntegration,
    HeroScreenshot,
    Logo,
  },
}
</script>

<template>
  <div>
    <Logo class="mt-32" />

    <div class="my-8 text-center">
      🐣️ The app that makes your #devlife easier.
    </div>

    <div class="flex justify-center my-16">
      <DownloadButton />
    </div>

    <HeroScreenshot class="my-16" />

    <HeroIntegration class="my-16" />

    <FeaturesGrid class="my-16" />

    <div class="flex justify-center my-16">
      <DownloadButton />
    </div>

    <footer class="text-center my-32 text-gray-500">
      <a href="https://github.com/Akryum/guijs/">
        GitHub repository
      </a>
    </footer>
  </div>
</template>
