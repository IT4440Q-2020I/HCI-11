<template>
  <div class="learning__content">
    <div style="width: 100%; background: #FFFFFF; height: 100%">
      <LearningCourseVideo
        v-if="type === 'video'"
        ref="learning-course-video"
        :currentLesson="currentLesson"
        @showDialogDescription="showDialogDescription"
        @nextLesson="$emit('nextLesson')"
        @endLesson="value => $emit('endLesson', value)"
      />
      <LearningCourseVimeo
        v-if="type === 'vimeo'"
        :currentLesson="currentLesson"
        @showDialogDescription="showDialogDescription"
        @nextLesson="$emit('nextLesson')"
        @endLesson="value => $emit('endLesson', value)"
      />
      <LearningCourseUploadHomework
        v-if="type === 'homework'"
        :currentLesson="currentLesson"
        @nextLesson="$emit('nextLesson')"
        @endLesson="value => $emit('endLesson', value)"
      />
      <LearningCourseViewPDF
        v-if="type === 'pdf'"
        :currentLesson="currentLesson"
        @showDialogDescription="showDialogDescription"
        @nextLesson="$emit('nextLesson')"
        @endLesson="value => $emit('endLesson', value)"
      />
      <LearningCourseTest
        v-if="type === 'test'"
        :currentLesson="currentLesson"
        @nextLesson="$emit('nextLesson')"
        @endLesson="value => $emit('endLesson', value)"
        ref="learning-section-test"
      />
      <LearningCourseExerciseTest
        v-if="type === 'exercise'"
        :currentLesson="currentLesson"
        @nextLesson="$emit('nextLesson')"
        @endLesson="value => $emit('endLesson', value)"
        ref="learning-exercise-test"
      />
      <LearningCourseDialogAttachment
        ref="dialog-attachment"
        :currentLesson="currentLesson"
      />
    </div>
  </div>
</template>
<script>
import get from 'lodash-es/get'
import LearningCourseVideo from '@/modules/Learning/components/MainSection/LearningCourseVideo'
import LearningCourseVimeo from '@/modules/Learning/components/MainSection/LearningCourseVimeo'
import LearningCourseTest from '@/modules/Learning/components/MainSection/LearningCourseTest'
import LearningCourseExerciseTest from '@/modules/Learning/components/MainSection/LearningCourseExerciseTest'
import LearningCourseViewPDF from '@/modules/Learning/components/MainSection/LearningCoursePdf'
import LearningCourseUploadHomework from '@/modules/Learning/components/MainSection/LearningCourseUploadHomework'
import LearningCourseDialogAttachment from '@/modules/Learning/components/MainSection/LearningCourseDialogAttachment'
export default {
  props: {
    currentLesson: Object,
    userCourse: Object,
  },
  components: {
    LearningCourseDialogAttachment,
    LearningCourseVideo,
    LearningCourseVimeo,
    LearningCourseUploadHomework,
    LearningCourseViewPDF,
    LearningCourseTest,
    LearningCourseExerciseTest,
  },
  computed: {
    type() {
      return get(this.currentLesson, 'type')
    }
  },
  methods: {
    checkDoingTest() {
      if (this.type === 'exercise') {
        return this.$refs['learning-exercise-test'].isDoingTest
      } else if (this.type === 'test') {
        return this.$refs['learning-section-test'].isDoingTest
      } else return false
    },
    showDialogDescription() {
      this.$refs['dialog-attachment'].showDialogDescription()
    },
    getSectionTest() {
      if (this.type === 'test') {
        return this.$refs['learning-section-test'].getSectionTest()
      } else if (this.type === 'exercise') {
        return this.$refs['learning-exercise-test'].getExcerciseTest()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.learning__content {
  border-top: 1px solid #f2f0f1;
  height: 100%;
  overflow: auto;
}
@media screen and (max-width: 600px) {
  .learning__content {
    padding: 24px;
    width: 100%;
    height: 100%;
  }
}
</style>
