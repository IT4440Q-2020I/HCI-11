<template>
  <div ref="scroll-homework" class="pa-5">
    <HomeworkDescription
      :title="$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.DESCRIPTION')"
      :hasDescription="currentLesson.data && currentLesson.data.hasDescription && !!currentLesson.description"
      :description="currentLesson.description"
    />
    <HomeworkAttachment
      :hasSyllabus="currentLesson.data && currentLesson.data.hasAttachment"
      :syllabus="currentLesson.syllabus"
    />
    <HomeworkRules :settings="currentLesson.settings ? currentLesson.settings : {}" />
    <HomeworkDescription :title="$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.REQUIREMENT')" :hasDescription="!!currentLesson.homeworkQuestion" :description="currentLesson.homeworkQuestion" />
    <!-- <HomeworkResult v-if="homeworks && homeworks.length" :homework="homeworks && homeworks[0]" /> -->
    <HomeworkUpload
      @endLesson="(value) => $emit('endLesson', value)"
      v-show="isShowUploadPart()"
      :unit="currentLesson"
    />
    <HomeworkSharingResult
      v-if="homeworks && homeworks.length"
      :item="homeworks && homeworks[0]"
    />
    <HomeworkSharing v-if="homeworks && homeworks.length" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import HomeworkDescription from '@/components/learning/Homework/HomeworkDescription'
import HomeworkAttachment from '@/components/learning/Homework/HomeworkAttachment'
import HomeworkRules from '@/components/learning/Homework/HomeworkRules'
import HomeworkUpload from '@/components/learning/Homework/HomeworkUpload'
// import HomeworkResult from '@/components/learning/Homework/HomeworkResult'
import HomeworkSharing from '@/components/learning/Homework/HomeworkSharing'
import HomeworkSharingResult from '@/components/learning/Homework/HomeworkSharingResult'
export default {
  components: {
    HomeworkDescription,
    HomeworkAttachment,
    HomeworkRules,
    HomeworkUpload,
    // HomeworkResult,
    HomeworkSharing,
    HomeworkSharingResult,
  },
  props: {
    currentLesson: Object,
  },
  async mounted() {
    setTimeout(() => {
      this.caculateHeightForViewPort()
    }, 1000)
    await this.getResultHomework({
      userId: this.authUser.id,
      unit: this.currentLesson.id,
    })
  },
  methods: {
    ...mapActions({
      getResultHomework: 'homework/fetchHomeworks',
    }),
    isShowUploadPart() {
      if (this.validateTime()) {
        if (!this.currentLesson.settings.submitCount) {
          return true
        } else {
          return !this.homeworks.length
        }
      } else {
        return false
      }
    },
    validateTime() {
      const settings = this.currentLesson.settings
      if (settings.hasRangeTime) {
        const timeZone = moment().valueOf()
        const startTime = moment(
          `${settings.rangeTimeFromDate}T${settings.rangeTimeFromHour}:00.000+07:00`
        ).valueOf()
        const endTime = moment(
          `${settings.rangeTimeToDate}T${settings.rangeTimeToHour}:00.000+07:00`
        ).valueOf()
        return timeZone > startTime && timeZone < endTime
      } else return true
    },
    caculateHeightForViewPort() {
      const wrapperCanvasScroll = this.$refs['scroll-homework']
      if (wrapperCanvasScroll) {
        wrapperCanvasScroll.setAttribute(
          'style',
          `height: ${window.innerHeight - 50}px; max-width: 100%;`
        )
      }
    },
  },
  computed: {
    ...mapGetters({
      homeworks: 'homework/getHomeworks',
      authUser: 'auth/getAuthUser',
      vendor: 'vendor/getVendor',
    }),
  },
  watch: {
    homeworks: {
      handler() {
        this.isShowUploadPart()
      },
      immediate: true,
    },
    currentLesson: {
      handler() {
        this.getResultHomework({
          userId: this.authUser.id,
          unit: this.currentLesson.id,
        })
      },
      immediate: true,
    },
  },
}
</script>
