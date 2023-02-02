<script>
const services = import.meta.globEager('./service/*.vue')

export default {
  functional: true,
  render (h) {
    const keys = Object.keys(services)
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
