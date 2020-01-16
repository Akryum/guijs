<script>
const services = require.context('./service', true, /Service\.vue$/)

export default {
  functional: true,
  render (h) {
    const keys = services.keys()
    return keys.map(key => {
      let component = services(key)
      component = component.default || component
      if (!component.render) {
        component.render = () => null
      }
      return h(component)
    })
  },
}
</script>
