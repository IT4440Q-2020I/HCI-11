<template>
  <div class="course-slide-view full-width d-inline-block">
    <ViewPdf :pdf-link="pdfLink" />
    <div class="completed-btn text-align-center d-flex justify-center">
      <DecoratorButton @click="finishHandler" variation="primary">Hoàn thiện và tiếp tục</DecoratorButton>
    </div>
  </div>
</template>
<script>
import get from 'lodash-es/get'
import ViewPdf from '@/components/learning/PdfViewer'
export default {
  components: {
    ViewPdf
  },
  props: {
    lessonData: {
      type: Object,
      required: true
    }
  },
  methods: {
    finishHandler () {
      this.$emit('next-lesson')
    }
  },
  computed: {
    pdfLink () {
      const rootLink = get(this.lessonData,'pdf.origin.link')
      const link = rootLink.includes('http')
        ? rootLink
        : this.$utils.combineLinkWithBucket(rootLink)
      return this.$utils.convertURL(link)
    }
  }
}
</script>
<style lang="scss" scoped>
.completed-btn {
  border-top: 1px solid #f2f0f1;
}
.course-slide-view {
  height: calc(100% - 16px - 24px);
  vertical-align: top;
}
</style>
