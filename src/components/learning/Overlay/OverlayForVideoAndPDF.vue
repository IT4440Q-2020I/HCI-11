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
    <OverlayRangeTime :setting="unit.settings ? unit.settings : {}" />
  </div>
</template>
<script>
import OverlayRangeTime from '@/components/learning/Overlay/OverlayRangeTime'
import OverlayAttachment from '@/components/learning/Overlay/OverlayAttachment'
import OverlayDescription from '@/components/learning/Overlay/OverlayDescription'
export default {
  components: {
    OverlayDescription,
    OverlayRangeTime,
    OverlayAttachment,
  },
  props: {
    unit: Object,
  },
  methods: {},
}
</script>
