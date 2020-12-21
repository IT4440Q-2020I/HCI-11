<template>
  <div class="test__answer-sheet__overview">
    <div class="d-flex justify-space-between" v-if="settings">
      <div>
        <TextStyle class="mr-2 d-inline-flex align-center" variation="subtext" noMargin>{{$vuetify.lang.t('$vuetify.LEARNING.HAS_ANSWERED')}}:</TextStyle>
        <TextStyle font-type=" body-1" inline noMargin>{{lengthQuestionsAnswered}}/{{questions.length}}</TextStyle>
      </div>
      <CountDownClock
        v-show="totalTime && !isShowResult"
        ref="clock"
        @update="(data) => timeHandler(data)"
        :total-time="totalTime"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    settings: Object,
    isShowResult: Boolean,
    questions: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters({
      remainingTime: 'unit/getRemainingTime',
    }),
    totalTime() {
      const time =
        Number(this.settings.hasLimitedTime) &&
        Number(this.settings.expiredTime) > 0
          ? Number(this.remainingTime) * 60
          : undefined
      return time
    },
    lengthQuestionsAnswered() {
      return this.questions.filter((question) => {
        return question.selection && question.selection.length
      }).length
    },
  },
  methods: {
    timeHandler(data) {
      this.$emit('timeHandler', data)
    },
    actionWithClock(type) {
      if (type === 'start') {
        this.$refs['clock'].start()
      } else if (type === 'stop') {
        this.$refs['clock'].stop()
      } else if (type === 'restart') {
        this.$refs['clock'].restart()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.test__answer-sheet__overview {
  padding: 8px 24px;
  border-bottom: 1px solid #dddbda;
}
</style>