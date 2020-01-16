<script>
import FindModal from './find/FindModal.vue'
import ImportProjectModal from './project/ImportProjectModal.vue'

export default {
  functional: true,
  render (h) {
    return [
      h(FindModal),
      h(ImportProjectModal),
    ]
  },
}
</script>
