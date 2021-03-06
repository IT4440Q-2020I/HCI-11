<template>
  <div>
    <base-loading v-if="loading" fluid color="primary" style="height: 100vh;" />
    <OverlayForTest
      v-show="showOverlay"
      ref="overlay"
      :unit="currentLesson"
      :exam="exam"
      :submission="submission"
      @startTest="startTest"
      @continueTest="continueTest"
      @showResult="showResult"
      @nextLesson="$emit('nextLesson')"
    />
    <div v-show="!showOverlay">
      <div class="pdf-file d-inline-block">
        <ViewPdf :pdfLink="getPDFLink" />
      </div>
      <div class="answer-sheet-wrapper d-inline-block">
        <AnswerSheet
          v-if="!showAnswer"
          class="answer-sheet-lg"
          ref="new-answer-sheet"
          :questions="questions"
          :submission="submission"
          :settings="exam && exam.settings"
          @startTestAgain="startTest"
          @submit="(answersSheet) => submit(answersSheet)"
          @saveAnswers="(answersSheet) => saveAnswers(answersSheet)"
          @synchronize="(questions) => synchronize(questions)"
        />
        <AnswerSheetMobile
          v-else
          class="answer-sheet-lg"
          ref="new-answer-sheet-mobile"
          :questions="questions"
          :submission="submission"
          :settings=" exam.settings"
          @startTestAgain="startTest"
          @submit="(answersSheet) => submit(answersSheet)"
          @saveAnswers="(answersSheet) => saveAnswers(answersSheet)"
          @synchronize="(questions) => synchronize(questions)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ViewPdf from '@/components/learning/PdfViewer'
import OverlayForTest from '@/components/learning/Overlay/OverlayForTest'
import AnswerSheet from '@/components/learning/Exam/AnswerSheet'
import AnswerSheetMobile from '@/components/learning/Exam/AnswerSheetMobile'
import moment from 'moment'
import { get } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    OverlayForTest,
    ViewPdf,
    AnswerSheet,
    AnswerSheetMobile,
  },
  props: {
    currentLesson: Object,
  },
  data() {
    return {
      isDoingTest: false,
      startTimeTest: null,
      showOverlay: true,
      loading: false,
    }
  },
  methods: {
    ...mapActions({
      fetchExamById: 'exam/fetchExamById',
      fetchQuestions: 'question/fetchQuestions',
      setQuestions: 'question/setQuestions',
      updateRemainingTime: 'unit/updateRemainingTime',
      updateIsStartChecking: 'unit/updateIsStartChecking',
      updateTimeoutRemainingTime: 'unit/updateTimeoutRemainingTime',
      clearTimeoutRemainingTime: 'unit/clearTimeoutRemainingTime',
      createSubmission: 'submission/createSubmission',
      updateSubmission: 'submission/updateSubmission',
      fetchSubmission: 'submission/fetchSubmission',
    }),
    async init() {
      this.loading = true
      if (this.currentLesson && this.currentLesson.exam) {
        await this.fetchExamById(this.currentLesson.exam)
        await this.fetchQuestions({ exam: this.currentLesson.exam })
        await this.fetchSubmission({
          userId: this.authUser.id,
          exam: this.currentLesson.exam,
        })
        await this.clearTimeoutRemainingTime()
        await this.caculateRemainingTime()
        this.showOverlay = true
      }
      this.loading = false
    },
    caculateCountDownTime() {
      const settings = this.exam.settings
      if (!this.isStartChecking) return
      let remainingTime = 0
      const currentTime = moment().valueOf()
      const startTime = moment(this.submission.startTime).valueOf()
      const usedTime = (currentTime - startTime) / 1000 / 60
      if (usedTime < settings.expiredTime) {
        remainingTime = Math.ceil(settings.expiredTime - usedTime)
      } else {
        if (settings.expiredTime) {
          remainingTime = 0
          this.autoSubmitWhenTimeout()
        }
      }
      this.updateRemainingTime(remainingTime)
      this.trackingWhenDoingTest()
    },
    trackingWhenDoingTest() {
      let timeout = setTimeout(() => {
        this.caculateCountDownTime()
      }, 2000)
      this.updateTimeoutRemainingTime(timeout)
    },
    async caculateRemainingTime() {
      await this.controlTracking(false)
      const state = this.submission.state
      const settings = this.exam.settings
      if (settings.hasLimitedTime && settings.expiredTime) {
        if (state && state !== 'final') {
          await this.controlTracking(true)
          this.caculateCountDownTime()
        } else {
          this.updateRemainingTime(settings.expiredTime)
        }
      } else {
        this.updateRemainingTime(null)
      }
    },
    controlTracking(isStartChecking) {
      this.updateIsStartChecking(isStartChecking)
    },
    synchronize(questions) {
      this.setQuestions(questions)
    },
    async autoSubmitWhenTimeout() {
      const answersSheet = await this.$utils.getListAnswersFromSubmission(
        this.submission.answers
      )
      this.submit(answersSheet)
    },
    async startTest() {
      this.loading = true
      this.startTimeTest = new Date()
      const data = this.getDataForSubmission({
        state: 'started',
        submitCount: 1,
        submitTime: null,
        answersSheet: {},
      })
      try {
        if (this.submission._id) {
          await this.updateSubmission({
            id: this.submission._id,
            state: 'done',
            exam: this.currentLesson.exam,
          })
        }
        await this.createSubmission(data)
      } catch (error) {
        this.$message.error(error || this.$vuetify.lang.t('$vuetify.MESSAGES.ERROR_TRY_AGAIN'))
      }
      await this.controlTracking(false)
      this.loading = false
      this.showOverlay = false
      if (!this.showAnswer) {
        this.$refs['new-answer-sheet'].start()
      } else this.$refs['new-answer-sheet-mobile'].start()
      this.isDoingTest = true
    },
    async continueTest() {
      this.loading = true
      try {
        await this.updateSubmission({
          exam: this.currentLesson.exam,
          id: this.submission._id,
          state: 'doing',
        })
        await this.controlTracking(false)
        this.loading = false
        this.showOverlay = false
        if (!this.showAnswer) {
          this.$refs['new-answer-sheet'].continue()
        } else this.$refs['new-answer-sheet-mobile'].continue()
        this.isDoingTest = true
      } catch (error) {
        this.$message.error(error || this.$vuetify.lang.t('$vuetify.MESSAGES.ERROR_TRY_AGAIN'))
      }
    },
    showResult() {
      this.showOverlay = false
      if (!this.showAnswer) {
        this.$refs['new-answer-sheet'].showResult()
      } else this.$refs['new-answer-sheet-mobile'].showResult()
      this.isDoingTest = false
    },
    logProgress() {
      this.$emit('endLesson', {
        duration: new Date().getTime(),
        time: new Date().getTime(),
        isDone: true,
        type: 'exercise',
      })
    },
    async submit(answersSheet) {
      this.loading = true
      if (!this.showAnswer) {
        this.$refs['new-answer-sheet'].stop()
      } else this.$refs['new-answer-sheet-mobile'].stop()
      const data = this.getDataForSubmission({
        state: 'final',
        submitCount: this.submission.submitCount + 1,
        submitTime: new Date(),
        answersSheet,
      })
      try {
        await this.updateSubmission({
          id: this.submission.id,
          ...data,
        })
        await this.clearTimeoutRemainingTime()
        this.updateRemainingTime(this.exam.settings.expiredTime)
        this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.SUBMIT_ANSWERS'))
        this.logProgress()
        this.loading = false
        this.isDoingTest = false
        this.showOverlay = true
        this.$refs['overlay'].openPopupNextLesson()
      } catch (error) {
        this.$message.error(error || this.$vuetify.lang.t('$vuetify.MESSAGES.ERROR_TRY_AGAIN'))
      }
    },
    async saveAnswers(answersSheet) {
      await this.updateSubmission({
        id: this.submission._id,
        state: 'doing',
        answers: answersSheet,
        exam: this.currentLesson.exam,
      })
    },
    getDataForSubmission({ state, submitCount, submitTime, answersSheet }) {
      return {
        course: this.currentLesson.course,
        exam: this.currentLesson.exam,
        submitTime: submitTime,
        startTime: this.startTimeTest,
        state,
        submitCount,
        endTime: submitTime,
        answers: answersSheet,
        type: 'normal-test',
        vendorId: this.vendor.vendorId,
        userId: this.authUser.id,
        name: this.authUser.name,
        email: this.authUser.email,
      }
    },
  },
  computed: {
    ...mapGetters({
      exam: 'exam/getExam',
      questions: 'question/getQuestions',
      submission: 'submission/getSubmission',
      isStartChecking: 'unit/getIsStartChecking',
      authUser: 'auth/getAuthUser',
      vendor: 'vendor/getVendor',
    }),
    getPDFLink() {
      const originPDF = get(this.exam, 'resources.0.origin')
      if (!originPDF) return ''
      return originPDF && originPDF.link.includes('http')
        ? originPDF.link
        : this.$utils.combineLinkWithBucket(originPDF.link)
    },
    showAnswer() {
      let breakpoints = this.$vuetify.breakpoint
      return breakpoints.xs || breakpoints.sm
    },
  },
  watch: {
    currentLesson: {
      handler(unit) {
        if (unit) this.init()
      },
      immediate: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.pdf-file {
  width: calc(100% - 336px);
  height: calc(100vh - 60px - 48px);
  vertical-align: top;
  padding-right: 30px;
}
.answer-sheet-wrapper {
  width: 319px;
}
@media only screen and (max-width: 960px) {
  .pdf-file {
    padding-right: 0px;
    width: 100%;
  }
  .answer-sheet-wrapper {
    width: 100%;
  }
}
</style>

