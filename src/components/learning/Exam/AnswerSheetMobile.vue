<template>
  <div>
    <BaseToggle>
      <template slot="view-more__trigger--bottom" slot-scope="props">
        <div @click="props.on" class="btn-answer-mobile">
          <QuestionHeaderAnswerSheetMobile
            ref="header"
            @active="isActive = !isActive"
            @timeHandler="timeHandler"
            :isActive="isActive"
            :settings="settings"
            :questions="questionsAnswered"
            :isShowResult="isShowResult"
          />
        </div>
      </template>
      <template>
        <div
          class="test__answer-sheet"
          :class="
            isActive
              ? ' test__answer-sheet_mobile  '
              : 'test__answer-sheet_mobile test__answer-sheet__remove'
          "
        >
          <div class="test__answer-sheet__overview">
            <QuestionHeaderButtonSubmit
              @submit="submit"
              @again="excuteAgain"
              :isEnableButtonReDo="isEnableButtonReDo"
              :validateTime="validateTime"
              :settings="settings"
            />
          </div>
          <div class="question__wrapper">
            <div
              class="question question-mobile"
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
          <QuestionHeaderButtonSubmit
            @submit="submit"
            @again="excuteAgain"
            :isEnableButtonReDo="isEnableButtonReDo"
            :validateTime="validateTime"
            :settings="settings"
          />
        </div>
      </template>
    </BaseToggle>
    <PopupConfirm :dialog="isOpenDialog" @onCancel="()=> isOpenDialog = false">
      <DecoratorButton @click="confirmSubmit" text>
        <TextStyle variation="primary" style="color:#ff1d30" font-type="subtitle-1" noMargin>{{$vuetify.lang.t('$vuetify.LEARNING.SUBMIT')}}</TextStyle>
      </DecoratorButton>
    </PopupConfirm>
  </div>
</template>
<script>
import QuestionHeaderButtonSubmit from '@/components/learning/Exam/QuestionHeaderButtonSubmit'
import QuestionHeaderAnswerSheetMobile from '@/components/learning/Exam/QuestionHeaderAnswerSheetMobile'
import PopupConfirm from '@/components/learning/Popup/PopupConfirmSubmit'
import QuestionOneCorrect from '@/components/learning/Exam/QuestionOneCorrect'
import QuestionMultipleCorrect from '@/components/learning/Exam/QuestionMultipleCorrect'
import QuestionFillBlank from '@/components/learning/Exam/QuestionFillBlank'
export default {
  components: {
    PopupConfirm,
    QuestionHeaderAnswerSheetMobile,
    QuestionOneCorrect,
    QuestionMultipleCorrect,
    QuestionFillBlank,
    QuestionHeaderButtonSubmit,
  },
  props: {
    questions: Array,
    submission: Object,
    settings: Object,
  },
  data() {
    return {
      isActive: false,
      isShowResult: false,
      isEnableButtonReDo: false,
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
      if (this.settings.hasLimitedTime && this.settings.expiredTime)
        this.$refs['header'].actionWithClock('start')
      this.reset()
      if (this.submission.state === 'doing') {
        this.setContinueAnswers()
      }
      this.enableTrackingAnswers = true
      this.runTrackingSaveAnswers()
    },
    stop() {
      if (this.settings.hasLimitedTime && this.settings.expiredTime)
        this.$refs['header'].actionWithClock('stop')
      this.enableTrackingAnswers = false
    },
    start() {
      if (this.settings.hasLimitedTime && this.settings.expiredTime)
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
      this.isOpenDialog = false
    },
    showResult() {
      this.mapQuestionsWithSelectionsAndCorrects()
      this.isEnableButtonReDo = true
      this.isShowResult = true
    },

    timeHandler(payload) {
      if (this.settings.hasLimitedTime)
        if (payload.time === 0) this.confirmSubmit()
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

<style lang="scss">
.test__answer-sheet {
  border: 1px solid #dddbda;
  border-radius: 4px;
  height: 0;
  transition: height 1s ease;

  .question {
    display: flex;
    margin-bottom: 24px;
    align-items: center;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
  .test__answer-sheet__overview {
    border-bottom: 1px solid #dddbda;
  }
  .pa-3 {
    .v-btn {
      color: #ff1d30 !important;
    }
  }
  .question__wrapper {
    padding: 16px 0;
    border-bottom: 1px solid #dddbda;
    overflow: auto;
    height: calc(100% - 180px);
  }
  .question-mobile {
    padding: 15px;
  }
  .question-mobile:nth-child(odd) {
    background: #f8f8f8;
  }

  .question__answers {
    .question__answer {
      display: inline-block;
      .question__answer__label {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        min-height: 24px;
        border-radius: 50%;
        background: #fafbfc;
        box-shadow: 0 0 0 1px #dddbda;
        margin-right: 12px;
        vertical-align: top;
      }
    }
  }

  .paging__navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #79797c;
    width: 88px;
    height: 24px;
    border-radius: 24px;
  }
}
.test__answer-sheet_mobile {
  position: absolute;
  overflow: scroll;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  background: white;
  border: none;
  height: 100%;
  padding-bottom: 72px;
}
.test__answer-sheet__remove {
  height: 0% !important;
}
.btn-answer-mobile {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  border-radius: 4px 4px 0px 0px;
  padding: 8px 16px;
  box-shadow: 0px -4px 8px rgba(62, 62, 60, 0.24);
  background: white;
  .v-btn .v-btn__content {
    display: flex;
    justify-content: space-between;
  }
}
@media only screen and (max-width: 960px) {
  .test__answer-sheet {
    .question {
      margin-bottom: 0px;
    }
    .question__answers {
      margin-bottom: 0px !important;
    }
  }
}
</style>
