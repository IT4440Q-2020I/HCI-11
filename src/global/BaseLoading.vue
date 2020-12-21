<template>
  <div class="base__loading" :class="[fluid ? 'base__loading--fluid': '', size ? `base__loading--${size}` : '', block ? `base__loading--block` : '']">
    <v-progress-circular
      indeterminate
      :color="color"
      :size="actualSize"
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  props: {
    fluid: Boolean,
    size: { type: String, default: 'md' },
    block: Boolean,
    color: { type: String, default: '' }
  },
  computed: {
    actualSize () {
      return {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 32,
        xl: 40
      }[this.size]
    }
  }
}
</script>

<style lang="scss">
.base__loading {
  display: inline-block;
  &.base__loading--block {
    display: block;
    text-align: center;
  }
}
.base__loading--fluid {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.base__loading--lg {
  font-size: 60px;
}
</style>
