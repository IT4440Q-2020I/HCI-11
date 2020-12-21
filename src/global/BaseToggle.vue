<template>
  <div class="element view-more">
    <div class="view-more__trigger--top">
      <slot name="view-more__trigger--top" :on="toggleFullState" :state="isFull"></slot>
    </div>
    <div class="view-more__wrapper" :style="{ height: `${localHeightWrapper}px` }">
      <div ref="view-more__content" class="view-more__content"><slot></slot></div>
    </div>
    <div class="view-more__trigger--bottom">
      <slot name="view-more__trigger--bottom" :on="toggleFullState" :state="isFull"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    heightAbstractView: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      localHeightWrapper: 0,
      localHeightContent: 0,
      isFull: false,
    }
  },
  mounted() {
    this.localHeightWrapper = this.heightAbstractView
  },
  watch: {
    isFull(val) {
      if (!val) {
        this.localHeightWrapper = this.heightAbstractView
      } else {
        this.localHeightWrapper = this.$refs["view-more__content"].clientHeight
      }
    },
  },
  methods: {
    toggleFullState() {
      this.isFull = !this.isFull
    },
    collapase() {
      this.isFull = false
    },
    expand() {
      this.isFull = true
    },
  },
}
</script>
<style lang="scss">
.view-more__wrapper {
  overflow: hidden;
  transition: all 0.3s;
}
</style>