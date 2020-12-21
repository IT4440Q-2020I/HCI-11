<template>
  <div>
    <OverlayForVideoAndPDF v-if="!validateTime" :unit="currentLesson" />
    <SlideViewer v-else :lesson-data="lesson" @next-lesson="nextLesson" ref="pdf" />
  </div>
</template>
<script>
import OverlayForVideoAndPDF from '@/components/learning/Overlay/OverlayForVideoAndPDF'
import SlideViewer from '@/components/learning/SlideViewer'
import moment from 'moment'
export default {
  components: {
    SlideViewer,
    OverlayForVideoAndPDF,
  },
  props: {
    currentLesson: Object,
  },
  data() {
    return {
      lesson: {},
    }
  },
  computed: {
    validateTime() {
      return this.$utils.validateTimeForLesson(this.currentLesson.settings)
    },
  },
  methods: {
    async nextLesson() {
      await this.$emit('endLesson', {
        time: moment().valueOf(),
        isDone: true,
        type: 'pdf',
      })
      this.$emit('nextLesson')
    },
    showDialogPdf() {
      setTimeout(() => this.$emit('showDialogDescription'), 200)
    },
  },
  watch: {
    currentLesson: {
      handler(lesson) {
        if (lesson) {
          this.lesson = lesson
          if (this.validateTime) this.showDialogPdf()
        }
      },
      immediate: true,
    },
  },
}
</script>
