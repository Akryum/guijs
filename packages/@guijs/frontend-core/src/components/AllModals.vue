<script>
const services = import.meta.globEager('./**/*Modal.vue')

export default {
  functional: true,
  render (h) {
    const keys = Object.keys(services).filter(key => !key.includes('Base'))
    return keys.map(key => {
      let component = services[key]
      component = component.default || component
      if (!component.render) {
        component.render = () => null
      }
      return h(component)
    })
  },
}
</script>
