<template>
  <div>
    <div class="d-flex justify-space-between align-center pa-3 white">
      <TextStyle class="subheading font-weight-medium" style="color: #79797C;" noMargin>{{$vuetify.lang.t('$vuetify.LEARNING.EXTENDED_INFORMATION')}}</TextStyle>
      <ElementIcon class="cursor-pointer" name="close" size="small" fill="#79797C" @click.native="props.toggleOverlayRightSidebar" />
    </div>
    <div>
      <ElementTabs default-tab="tab-1" class="ma-0 pa-0 learning-tabs">
        <template slot="tabs__navigation" class="bg-white">
          <ElementTabPanel tab-id="tab-1" ref="infoTabRef">{{$vuetify.lang.t('$vuetify.LEARNING.INTRODUCTION')}}</ElementTabPanel>
          <ElementTabPanel tab-id="tab-2" v-if="canShowAttachment">{{$vuetify.lang.t('$vuetify.LEARNING.ATTACHMENT')}}</ElementTabPanel>
          <ElementTabPanel tab-id="tab-3" v-if="canShowDiscussion">{{$vuetify.lang.t('$vuetify.LEARNING.DISCUSSION')}}</ElementTabPanel>
        </template>
        <template slot="tabs__content">
          <ElementTabContent tab-id="tab-1">
            <LearningCourseDescription
              :hasDescription="currentLesson.data && currentLesson.data.hasDescription"
              :description="currentLesson ? currentLesson.description : ''"
            />
          </ElementTabContent>
          <ElementTabContent tab-id="tab-2" v-if="canShowAttachment">
            <LearningCourseAttachment
              :props="props"
              :hasSyllabus="currentLesson.data && currentLesson.data.hasAttachment"
              :syllabus="currentLesson.syllabus ? currentLesson.syllabus : {}"
            />
          </ElementTabContent>
          <ElementTabContent tab-id="tab-3" v-if="canShowDiscussion" class="px-6">
            <LearningCourseDiscussion
              :props="props"
              :currentLesson="currentLesson"
              :currentCourse="currentCourse"
            />
          </ElementTabContent>
        </template>
      </ElementTabs>
    </div>
  </div>
</template>
<script>
import LearningCourseAttachment from '@/modules/Learning/components/RightSection/LearningCourseAttachment'
import LearningCourseDiscussion from '@/modules/Learning/components/RightSection/LearningCourseDiscussion'
import LearningCourseDescription from '@/modules/Learning/components/RightSection/LearningCourseDescription'
export default {
  components: {
    LearningCourseDiscussion,
    LearningCourseAttachment,
    LearningCourseDescription,
  },
  props: {
    props: Object,
    currentLesson: Object,
    currentCourse: Object,
  },
  computed: {
    canShowAttachment() {
      return this.currentLesson.syllabus && this.currentLesson.syllabus.id
    },
    canShowDiscussion() {
      if (
        this.currentCourse &&
        this.currentCourse.data &&
        this.currentCourse.data.canEnableDiscussion
      ) {
        if (
          this.currentLesson &&
          this.currentLesson.data &&
          typeof this.currentLesson.data.canEnableDiscussion === 'boolean'
        ) {
          return this.currentLesson.data.canEnableDiscussion
        }
        return true
      }
      return false
    },
  },
  watch: {
    canShowAttachment() {
      this.$refs['infoTabRef'].$el.click()
    },
    canShowDiscussion() {
      this.$refs['infoTabRef'].$el.click()
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .tabs__navigation {
  margin-bottom: 0;
}
::v-deep .tabs__navigation__wrapper {
  background-color: #fff;
  color: #79797c;
}
::v-deep .text-style--default {
  color: #79797c;
}
::v-deep .text-style--primary {
  font-weight: 500;
}
::v-deep .element.tab-panel {
  padding: 16px;
}
::v-deep .element.tab-panel .text-style {
  font-size: 14px !important;
  margin: 0;
}
::v-deep .element.tabs .tabs__navigation .tabs__navigation__wrapper {
  margin-top: 0;
}
::v-deep .element.tabs .tabs__navigation .tabs__line:first-child {
  background-color: white;
}
// ::v-deep .element.wrapper {
//   padding: 0;
// }
</style>