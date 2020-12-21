<template>
  <DecoratorButton
    @click="$emit('active')"
    :text="isActive"
    block
    variation="primary"
    large
  >
    <div v-if="settings &&  Number(settings.expiredTime) > 0" class="d-flex">
      <v-icon :color="isActive ?'secondary':'white'" class="mr-2" icon="schedule" />
      <CountDownClock
        v-show="totalTime && !isShowResult"
        ref="clock"
        @update="(data) => timeHandler(data)"
        :total-time="totalTime"
        :class="{active:!isActive}"
      />
    </div>
    <span v-text="isActive ? 'Đóng' :'Trả Lời'" class="element text-style text-style--default subtitle-2"></span>
    <div class="d-flex align-center">
      <v-icon :color="isActive ?'secondary':'white'" class="mr-2">mdi-format-list-numbered</v-icon>
      <span
        :style="isActive ?'color: rgb(0, 17, 35)':''"
        class="element text-style text-style--default subtitle-2"
      >{{lengthQuestionsAnswered}}/{{questions.length}}</span>
    </div>
  </DecoratorButton>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    isActive: Boolean,
    settings: Object,
    questions: Array,
    isShowResult: Boolean,
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
::v-deep .display-clock span.element.text-style.text-style--primary.content--left.subtitle-2 {
  margin: 0;
  font-size: 14px !important;
  font-weight: 500;
  color: rgb(0, 17, 35);
}
::v-deep .count-down-clock.active .display-clock span.element.text-style.text-style--primary.content--left.subtitle-2 {
  color: white;
}
</style>