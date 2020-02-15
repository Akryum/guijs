<script>
const services = require.context('.', true, /Modal\.vue$/)

export default {
  functional: true,
  render (h) {
    const keys = services.keys().filter(key => !key.includes('Base'))
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
