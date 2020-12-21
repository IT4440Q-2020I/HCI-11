<template>
  <div>
    <div
      :style="{backgroundColor: props.theme.primaryColor}"
      class="icon-mobile d-flex full-width pa-4 justify-space-between"
    >
      <!-- <ElementIcon
        @click.native="backToDetailPage"
        v-show="!props.isMini"
        fill="#fff"
        class="cursor-pointer"
        name="keyboard_arrow_left"
      /> -->
      <v-icon
        @click.native="backToDetailPage"
        v-if="!props.isMini"
        color="#fff"
        class="cursor-poiner"
        >mdi-chevron-left</v-icon
      >
      <v-icon
        v-if="!props.isMini"
        @click.native="props.toggleSidebarMobile"
        color="#fff"
        class="cursor-pointer"
        >mdi-chevron-left-box</v-icon
      >
      <!-- <ElementIcon
        @click.native="props.toggleSidebarMobile"
        class="cursor-pointer"
        name="outline-check-box-left"
        fill="#fff"
      /> -->
    </div>
    <div @click="changeReportStatus" style="padding: 12px;">
      <TextStyle
        class="cursor-pointer"
        v-if="!props.isMini"
        @click.native="props.toggleSidebarMobile"
        no-margin
        v-text="courseTitle"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    props: Object,
    courseTitle: String
  },
  methods: {
    backToDetailPage() {
      this.$router.push(`/course-online-detail/${this.$route.params.courseId}`)
    },
    changeReportStatus() {
      const currentPath = this.$route.path
      const nextPath = `/course-online-learning/${this.$route.params.courseId}/report/result`
      if (currentPath !== nextPath) {
        this.$router.push(nextPath)
        this.$emit('changeReportStatus')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-mobile {
  height: fit-content;
  user-select: none;
  background-color: rgb(0, 132, 255);
}
</style>
