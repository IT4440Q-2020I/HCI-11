<template>
  <div class="test__root pa-4">
    <div v-for="(question, i) in questionsExam" :key="i">
      <div class="mb-4">
        <TextStyle class="mr-4" font-type="body-1">{{i + 1}}.</TextStyle>
        <span v-html="question.html" class="text-left inline"></span>
      </div>
      <QuestionOneCorrect
        v-if="question.type === 'single-choice'"
        v-model="question.selection"
        @synchronize="$emit('synchronize', questionsExam)"
        :selections="question.answers"
        :correct="question.correct"
        :index="i"
        :isShowResult="isShowResult"
        hasHtml
      />
      <QuestionMultipleCorrect
        v-else-if="question.type === 'multiple-choice-pdf' || question.type === 'multiple-choice'"
        v-model="question.selection"
        @synchronize="$emit('synchronize', questionsExam)"
        :selections="question.answers"
        :correct="question.correct"
        :index="i"
        :isShowResult="isShowResult"
        hasHtml
      />
      <QuestionFillBlank
        v-else-if="question.type === 'fill-blank'"
        v-model="question.selection"
        @synchronize="$emit('synchronize', questionsExam)"
        :question="question"
        :index="i"
        :isShowResult="isShowResult"
        isDisableOrder
      />
      <hr class="mt-3 mb-3" style="opacity: .3;" />
    </div>
  </div>
</template>
<script>
import QuestionMultipleCorrect from '@/components/learning/Exam/QuestionMultipleCorrect'
import QuestionOneCorrect from '@/components/learning/Exam/QuestionOneCorrect'
import QuestionFillBlank from '@/components/learning/Exam/QuestionFillBlank'
export default {
  components: {
    QuestionFillBlank,
    QuestionOneCorrect,
    QuestionMultipleCorrect,
  },
  props: {
    questions: Array,
    submission: Object,
    settings: Object,
  },
  data() {
    return {
      isShowResult: false,
      questionsExam: [],
    }
  },
  methods: {
    continue() {
      this.reset()
      if (this.submission.state === 'doing') {
        this.mapQuestionsWithSelectionsAndCorrects()
      }
    },
    pauseAudio() {
      const listAudio = document.getElementsByTagName('audio')
      Array.from(listAudio).forEach((audio) => {
        audio.pause()
      })
    },
    mapQuestionsWithSelectionsAndCorrects() {
      this.questionsExam = this.questionsExam.map((question) => {
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
    showResult() {
      this.mapQuestionsWithSelectionsAndCorrects()
      this.isShowResult = true
    },
    reset() {
      this.isShowResult = false
      this.questionsExam = this.questionsExam.map((question) => {
        return {
          ...question,
          selection: undefined,
        }
      })
    },
  },
  watch: {
    questions: {
      handler(questions) {
        if (questions && questions.length) this.questionsExam = questions
      },
      immediate: true,
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .test__root {
  height: calc(100vh - 60px - 48px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
