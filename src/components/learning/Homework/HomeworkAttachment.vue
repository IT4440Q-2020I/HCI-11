<template>
  <v-row no-gutters class="mb-4">
    <v-col cols="12" class="mb-2">
      <TextStyle font-type="subtitle-1">{{$vuetify.lang.t('$vuetify.LEARNING.ATTACHMENT')}}</TextStyle>
    </v-col>
    <v-col v-if="hasSyllabus" cols="12">
      <div class="attachment-wrapper d-flex align-center rounded pa-2 mb-1">
        <div class="attachment-file-icon mr-2">
          <v-icon class="element text-style caption-2 grey--text">mdi-paperclip</v-icon>
        </div>
        <div class="attachment-file-name">
          <TextStyle
            font-type="caption-2"
            class="mr-3 text--secondary"
            noMargin
          >{{syllabus ? syllabus.title : $vuetify.lang.t('$vuetify.LEARNING.NONAME_FILE')}}</TextStyle>
        </div>
        <div @click="onDownloadSyllabus" class="link-download-attachment">
          <TextStyle font-type="caption-2" class="download-attachment" noMargin>{{$vuetify.lang.t('$vuetify.LEARNING.DOWNLOAD')}}</TextStyle>
        </div>
      </div>
    </v-col>
    <v-col v-else cols="12">
      <div class="attachment-wrapper d-flex align-center rounded pa-2 mb-1">
        <TextStyle class="text--secondary" fontType="caption-2" noMargin>{{$vuetify.lang.t('$vuetify.LEARNING.CURRENT_COURSE_HAVE_NO_ATTACHMENT')}}</TextStyle>
      </div>
      <hr class="mt-4" style="opacity: .3;" />
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    hasSyllabus: Boolean,
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
.attachment-wrapper {
  height: 32px;
  border: 1px solid #f2f0f1;
  background-color: #f8f8f8;
  .attachment-file-icon {
    transform: scale(0.7);
  }
  .download-attachment {
    color: #3552ba;
    font-size: 12px;
  }
  .attachment-file-name {
    max-width: 30%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .link-download-attachment {
    & :hover {
      cursor: pointer;
    }
  }
}
</style>
