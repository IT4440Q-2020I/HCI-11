<template>
  <div class="flex mr-4">
    <v-btn
      text
      class="text-none"
      @click="props.toggleOverlayRightSidebar"
      :style="{
        'background-color': props.overlayRightSidebar
          ? $themeData.color_primary + '29'
          : 'transparent',
      }"
    >
      <v-icon
        class="mr-1 izteach-theme element text-style text-style--primary subtitle-1"
        >mdi-book-open</v-icon
      >
      <TextStyle font-type="body-1" class="text-style--primary" noMargin
        >{{$vuetify.lang.t('$vuetify.LEARNING.EXTENDED_INFORMATION')}}</TextStyle
      >
    </v-btn>
  </div>
</template>
<script>
export default {
  props: {
    currentCourse: Object,
    currentLesson: Object,
    props: Object,
  },
  watch: {
    currentLesson: {
      handler(val, oldVal) {
        if (
          val &&
          oldVal &&
          val.id !== oldVal &&
          this.props.overlayRightSidebar
        )
          this.props.closeRightSideBar()
      },
      immediate: true,
    },
  },
}
</script>
