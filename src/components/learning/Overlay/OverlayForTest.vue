<template>
  <div class="pa-5">
    <OverlayDescription
      :hasDescription="unit.data && unit.data.hasDescription"
      :description="unit.description"
    />
    <OverlayAttachment
      :hasSyllabus="unit.data && unit.data.hasAttachment"
      :syllabus="unit.syllabus"
    />
    <OverlayRules
      ref="rules"
      :setting="exam.settings"
      :submission="submission"
      @startTest="$emit('startTest')"
      @continueTest="$emit('continueTest')"
      @showResult="$emit('showResult')"
    />
    <OverlayResult
      v-if="submission.state === 'final'"
      :submission="submission"
      :hideResult="exam && exam.settings && exam.settings.hideResult"
      @showResult="$emit('showResult')"
    />
    <PopupConfirmContinue
      ref="popup-confirm-continue"
      :submission="submission"
      :setting="exam.settings"
      @showResult="$emit('showResult')"
      @nextLesson="$emit('nextLesson')"
    />
  </div>
</template>
<script>
import OverlayAttachment from '@/components/learning/Overlay/OverlayAttachment'
import OverlayDescription from '@/components/learning/Overlay/OverlayDescription'
import OverlayRules from '@/components/learning/Overlay/OverlayRules'
import OverlayResult from '@/components/learning/Overlay/OverlayResult'
import PopupConfirmContinue from '@/components/learning/Popup/PopupConfirmContinue'
export default {
  components: {
    OverlayDescription,
    OverlayAttachment,
    OverlayRules,
    OverlayResult,
    PopupConfirmContinue,
  },
  props: {
    unit: Object,
    exam: Object,
    submission: Object,
  },
  methods: {
    openPopupNextLesson() {
      this.$refs['popup-confirm-continue'].openDialog()
    },
  },
}
</script>
