<template>
  <div class="test__answer-sheet">
    <QuestionHeaderAnswerSheet
      ref="header"
      :settings="settings"
      :isShowResult="isShowResult"
      :questions="questionsAnswered"
      @timeHandler="timeHandler"
    />
    <div>
      <div class="question__wrapper">
        <div
          v-show="indexShowQuestion.includes(i + 1)"
          v-for="(question, i) in questionsAnswered"
          :key="i"
        >
          <QuestionOneCorrect
            v-if="question.type === 'single-choice-pdf' || question.type === 'single-choice'"
            v-model="question.selection"
            @synchronize="$emit('synchronize', questionsAnswered)"
            :selections="question.answers"
            :correct="question.correct"
            :index="i"
            :isShowResult="isShowResult"
          />
          <QuestionMultipleCorrect
            v-else-if="question.type === 'multiple-choice-pdf' || question.type === 'multiple-choice'"
            v-model="question.selection"
            @synchronize="$emit('synchronize', questionsAnswered)"
            :selections="question.answers"
            :correct="question.correct"
            :index="i"
            :isShowResult="isShowResult"
          />
          <QuestionFillBlank
            v-else-if="question.type === 'fill-blank'"
            v-model="question.selection"
            @synchronize="$emit('synchronize', questionsAnswered)"
            :question="question"
            :index="i"
            :isShowResult="isShowResult"
          />
        </div>
      </div>
      <QuestionActionExam
        :page="page"
        :totalPage="totalPage"
        :isEnableButtonReDo="isEnableButtonReDo"
        :validateTime="validateTime"
        :settings="settings"
        @excuteAgain="excuteAgain"
        @prevPage="prevPage"
        @nextPage="nextPage"
        @submit="submit"
      />
    </div>
    <PopupConfirm :dialog="isOpenDialog" @onCancel="()=> isOpenDialog = false">
      <DecoratorButton @click="confirmSubmit" text>
        <TextStyle variation="primary" style="color:#ff1d30" font-type="subtitle-1" noMargin>{{$vuetify.lang.t('$vuetify.LEARNING.SUBMIT')}}</TextStyle>
      </DecoratorButton>
    </PopupConfirm>
  </div>
</template>
<script>
import QuestionHeaderAnswerSheet from '@/components/learning/Exam/QuestionHeaderAnswerSheet'
import QuestionActionExam from '@/components/learning/Exam/QuestionActionExam'
import PopupConfirm from '@/components/learning/Popup/PopupConfirmSubmit'
import QuestionOneCorrect from '@/components/learning/Exam/QuestionOneCorrect'
import QuestionMultipleCorrect from '@/components/learning/Exam/QuestionMultipleCorrect'
import QuestionFillBlank from '@/components/learning/Exam/QuestionFillBlank'
export default {
  components: {
    PopupConfirm,
    QuestionOneCorrect,
    QuestionActionExam,
    QuestionHeaderAnswerSheet,
    QuestionMultipleCorrect,
    QuestionFillBlank,
  },
  props: {
    questions: Array,
    submission: Object,
    settings: Object,
  },
  data() {
    return {
      isShowResult: false,
      isEnableButtonReDo: false,
      page: 1,
      questionsPerPage: 10,
      questionsAnswered: [],
      answeredList: {},
      enableTrackingAnswers: false,
      isOpenDialog: false,
    }
  },
  computed: {
    validateTime() {
      return this.$utils.validateTimeForLesson(this.settings)
    },
    indexShowQuestion() {
      return Array.from(new Array(this.questionsPerPage), (x, i) => {
        return i + 1 + (this.page - 1) * this.questionsPerPage
      })
    },
    totalPage() {
      return Math.ceil(this.questions.length / 10)
    },
  },
  methods: {
    mapQuestionsWithSelectionsAndCorrects() {
      this.questionsAnswered = this.questionsAnswered.map((question) => {
        const result = this.submission.answers[question._id]
        if (result) {
          if (
            question.type === 'single-choice' ||
            question.type === 'single-choice-pdf'
          ) {
            return {
              ...question,
              selection: result.answerId,
              correct: result.correct,
            }
          } else if (
            question.type === 'multiple-choice' ||
            question.type === 'multiple-choice-pdf'
          ) {
            return {
              ...question,
              selection: result.answerIds,
              correct: result.correct,
            }
          } else if (question.type === 'fill-blank') {
            return {
              ...question,
              selection: result.answer,
              correct: result.correct,
              isCorrect: result.isCorrect,
            }
          }
        } else return question
      })
    },
    getAnswerListForSubmission(questionsAnswered) {
      questionsAnswered
        .filter((question) => {
          return question.selection && question.selection.length
        })
        .map((question) => {
          if (
            question.type === 'single-choice' ||
            question.type === 'single-choice-pdf'
          ) {
            this.answeredList[question._id] = {
              questionId: question.id,
              answerId: question.selection,
            }
          } else if (
            question.type === 'multiple-choice' ||
            question.type === 'multiple-choice-pdf'
          ) {
            this.answeredList[question._id] = {
              questionId: question.id,
              answerIds: question.selection,
            }
          } else if (question.type === 'fill-blank') {
            this.answeredList[question._id] = {
              questionId: question.id,
              answer: question.selection,
            }
          }
        })
    },
    submit() {
      this.enableTrackingAnswers = false
      this.isOpenDialog = false
      this.getAnswerListForSubmission(this.questionsAnswered)
      if (
        Object.keys(this.answeredList).length == this.questionsAnswered.length
      ) {
        this.$emit('submit', this.answeredList)
      } else {
        this.isOpenDialog = true
      }
    },
    confirmSubmit() {
      this.enableTrackingAnswers = false
      this.isOpenDialog = false
      this.$emit('submit', this.answeredList)
    },
    setContinueAnswers() {
      this.mapQuestionsWithSelectionsAndCorrects()
      this.page = 1
    },
    runTrackingSaveAnswers() {
      const minutesOfTracking = 1
      if (this.enableTrackingAnswers) {
        setTimeout(() => {
          if (this.enableTrackingAnswers) {
            this.getAnswerListForSubmission(this.questionsAnswered)
            this.$emit('saveAnswers', this.answeredList)
          }
          this.runTrackingSaveAnswers()
        }, minutesOfTracking * 60 * 1000)
      }
    },
    continue() {
      this.$refs['header'].actionWithClock('start')
      this.reset()
      if (this.submission.state === 'doing') {
        this.setContinueAnswers()
      }
      this.enableTrackingAnswers = true
      this.runTrackingSaveAnswers()
    },
    stop() {
      this.$refs['header'].actionWithClock('stop')
      this.enableTrackingAnswers = false
    },
    start() {
      this.$refs['header'].actionWithClock('restart')
      this.reset()
      this.enableTrackingAnswers = true
      this.runTrackingSaveAnswers()
    },
    async excuteAgain() {
      this.isEnableButtonReDo = false
      this.isShowResult = false
      await this.$emit('startTestAgain')
      this.start()
    },
    reset() {
      this.isShowResult = false
      this.isEnableButtonReDo = false
      this.questionsAnswered = this.questionsAnswered.map((question) => {
        return {
          ...question,
          selection: undefined,
        }
      })
      this.answeredList = {}
      this.page = 1
      this.isOpenDialog = false
    },
    showResult() {
      this.page = 1
      this.mapQuestionsWithSelectionsAndCorrects()
      this.isEnableButtonReDo = true
      this.isShowResult = true
    },

    timeHandler(payload) {
      if (this.settings.hasLimitedTime) {
        if (payload.time === 0) this.confirmSubmit()
      }
    },
    nextPage() {
      if (this.page < this.totalPage) this.page += 1
    },
    prevPage() {
      if (this.page > 1) this.page -= 1
    },
  },
  watch: {
    questions: {
      handler(questions) {
        if (questions.length) {
          this.questionsAnswered = questions
        }
      },
      immediate: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.test__answer-sheet {
  border: 1px solid #dddbda;
  height: 100%;
  border-radius: 4px;
  height: 100%;
  .question__wrapper {
    padding: 16px 24px 0;
    border-bottom: 1px solid #dddbda;
  }
}
</style>
