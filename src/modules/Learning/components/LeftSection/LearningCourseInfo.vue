<template>
  <div>
    <div
      class="pa-4 d-flex"
      style="user-select: none"
      :style="{
        backgroundColor: props.theme.primaryColor,
        justifyContent: props.isMini ? 'center' : 'space-between'
      }"
    >
      <v-icon
        @click.native="backToDetailPage"
        v-show="!props.isMini"
        color="#fff"
        class="cursor-pointer"
        >mdi-chevron-left</v-icon
      >
      <v-icon
        v-if="!props.isMini"
        @click.native="props.toggle"
        color="#fff"
        class="cursor-pointer"
        >mdi-chevron-left-box</v-icon
      >
      <v-icon
        v-else
        @click.native="props.toggle"
        color="#fff"
        class="cursor-pointer"
        >mdi-chevron-right-box</v-icon
      >
    </div>
    <div @click="onOpenReport" class="cursor-pointer">
      <div class="pa-4 pb-0" v-if="!props.isMini">
        <TextStyle class="text-center">{{ courseTitle }}</TextStyle>
      </div>
      <div v-show="!props.isMini" class="pa-4 pt-0">
        <div v-if="!reupdatePercent" class="text-center">
          <BaseLoading color="primary" class="my-4" />
        </div>
        <div v-else>
          <DecoratorProgressLinear :value="courseProgress" :width="4" />
          <div class="text-center">
            <TextStyle variation="primary" class="d-inline"
              >{{ courseProgress }}%</TextStyle
            >&nbsp;&nbsp;
            <TextStyle class="d-inline">{{
              $vuetify.lang.t('$vuetify.LEARNING.COMPLETED')
            }}</TextStyle>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import get from 'lodash-es/get'
export default {
  props: {
    props: Object,
    reupdatePercent: Boolean,
    courseTitle: String,
    userCourse: Object
  },
  methods: {
    onOpenReport() {
      const currentPath = this.$route.path
      const nextPath = `/course-online-learning/${this.$route.params.courseId}/report/result`
      if (currentPath !== nextPath) {
        this.$router.push(nextPath)
        this.$emit('changeReportStatus')
      }
    },
    backToDetailPage() {
      this.$router.push(`/course-online-detail/${this.$route.params.courseId}`)
    }
  },
  computed: {
    courseProgress() {
      const progress = Math.floor(
        get(this.userCourse, 'dataDetails.progress') || 0
      )
      return progress > 100 ? 100 : progress
    }
  }
}
</script>
<style lang="scss">
.report-btn {
  padding: 0 !important;
}
</style>
