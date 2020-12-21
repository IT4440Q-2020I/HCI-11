<template>
  <v-dialog class="player-dialog" v-model="dialog" width="350px">
    <v-card class="pa-4">
      <v-row class="d-flex flex-column justify-center text-center">
        <TextStyle class="text-center mb-1" font-type="subtitle-1">{{$vuetify.lang.t('$vuetify.LEARNING.CORRECT_ANSWERS')}}</TextStyle>
        <TextStyle class="text-center" font-type="title-2">{{score}}</TextStyle>
      </v-row>
      <div class="mt-1 text-center">
        <DecoratorButton
          v-if="setting && !setting.hideResult"
          @click="showResult"
          variation="secondary"
          text
          class="mr-2"
        >{{$vuetify.lang.t('$vuetify.LEARNING.RESULT')}}</DecoratorButton>
        <DecoratorButton @click="nextLesson" variation="primary">{{$vuetify.lang.t('$vuetify.LEARNING.NEXT_LESSON')}}</DecoratorButton>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    submission: Object,
    setting: Object
  },
  data () {
    return {
      dialog: false,
      score: '0/0'
    }
  },
  methods: {
    nextLesson () {
      this.$emit('nextLesson')
      this.dialog = false
    },
    showResult () {
      this.$emit('showResult')
      this.dialog = false
    },
    openDialog () {
      this.dialog = true
    }
  },
  watch: {
    submission: {
      handler (submission) {
        if (submission && submission.state === 'final') {
          this.score = `${submission.correct}/${submission.total}`
        }
      },
      immediate: true
    }
  }
}
</script>
