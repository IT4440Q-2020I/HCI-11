<template>
  <div>
    <div
      class="expand-syllabus--mobile d-flex d-sm-none pa-4"
      style="user-select: none"
      :style="{
        justifyContent: props.isMini ? 'center' : 'space-between',
        backgroundColor:
          (props.theme && props.theme.primaryColor) || '#4284FC'
      }"
    >
      <v-icon
        @click.native="props.toggleSidebarMobile"
        color="#fff"
        class="cursor-pointer"
      >mdi-chevron-right-box</v-icon>
      <!-- <ElementIcon
        @click.native="props.toggleSidebarMobile"
        class="cursor-pointer"
        name="outline-check-box-right"
        fill="#fff"
      />
      <ElementIcon
        @click.native="props.toggleSidebarMobile"
        class="cursor-pointer"
        name="outline-check-box-right"
        fill="#fff"
      /> -->
    </div>
    <div class="lesson-title d-none d-sm-block cursor-pointer">
      <TextStyle noMargin>{{ currentLesson && currentLesson.title }}</TextStyle>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    currentLesson: Object,
    props: Object,
  },
}
</script>
<style lang="scss">
.expand-syllabus--mobile {
  width: fit-content;
}
.lesson-title {
  margin-left: 28px;
}
</style>