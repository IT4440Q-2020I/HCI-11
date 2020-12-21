<template>
  <div v-if="hasSyllabus">
    <div class="download-wrapper py-4 px-5 d-flex justify-space-between align-center cursor-pointer" @click="onDownloadSyllabus">
      <TextStyle
        v-text="syllabus.title ? syllabus.title : $vuetify.lang.t('$vuetify.LEARNING.NONAME_FILE')"
        class="attachment-title ellipsis-one-line"
        fontType="body-1"
        noMargin
      />
      <v-icon :color="$themeData.color_primary">mdi-download</v-icon>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    hasSyllabus: Boolean,
    props: Object,
    syllabus: Object
  },
  methods: {
    onDownloadSyllabus () {
      this.$utils.onDownloadSyllabus(this.syllabus)
    }
  }
}
</script>
<style lang="scss" scoped>
.attachment-title {
  max-width: 175px;
  color: #79797c;
  font-size: 14px;
}
.download-wrapper {
  background: rgb(248, 248, 248);
}
</style>
