<script>
import { getImageUrl } from '@/util/image'

export default {
  functional: true,

  props: {
    folder: {
      type: Object,
      required: true,
    },
  },

  render (h, { props, listeners }) {
    return <div
      staticClass="folder-explorer-item"
      class={{
        hidden: props.folder.hidden,
      }}
      onClick={() => listeners.select()}
    >
      <VueIcon
        icon={props.folder.isPackage ? 'folder' : 'folder_open'}
        class="folder-icon big"
      />
      <div class="folder-name">
        { props.folder.name }
        { props.folder.projectType ? <img
          src={getImageUrl(props.folder.projectType.logo)}
          class="project-icon"
        /> : null }
      </div>
      { props.folder.favorite ? <VueIcon
        icon="star"
        class="favorite-icon"
      /> : null }
    </div>
  },
}
</script>

<style lang="stylus" scoped>
.folder-explorer-item
  padding $padding-item
  h-box()
  align-items center
  user-select none
  cursor pointer
  position relative

  &:hover
    background rgba($vue-ui-color-primary, .1)

    .project-icon
      opacity 1

  &.hidden
    opacity .5

  .folder-icon
    margin 0 4px
    >>> svg
      fill $vue-ui-color-primary

  .folder-name
    flex 100% 1 1
    margin-left $padding-item
    ellipsis()

  .project-icon
    width 18px
    height @width
    vertical-align top
    position relative
    top 3px
    margin-left ($padding-item / 2)
    border-radius 50%
    opacity .3

  .favorite-icon
    >>> svg
      fill $vue-ui-color-primary

</style>
