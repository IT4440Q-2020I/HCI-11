<template>
  <v-dialog class="player-dialog" v-model="dialog" width="500px">
    <v-card class="pa-4">
      <div v-if="currentLesson.description" class="mb-4">
        <TextStyle style="font-size: 18px;">{{$vuetify.lang.t('$vuetify.LEARNING.DESCRIPTION')}}:</TextStyle>
        <div style="max-height: 200px;overflow-x: hidden; overflow-y: scroll">
          <TextStyle>{{currentLesson.description}}</TextStyle>
        </div>
      </div>
      <v-row v-if="currentLesson.syllabus" no-gutters class="mb-5">
        <v-col cols="12" md="12" lg="4" style="margin-bottom: 8px;">
          <TextStyle class="my-0">{{$vuetify.lang.t('$vuetify.LEARNING.ATTACHMENT')}}:</TextStyle>
        </v-col>
        <v-col cols="12" md="12" lg="8">
          <div class="attachment-wrapper d-flex align-center rounded pa-2 mb-1">
            <div class="attachment-file-icon mr-3">
              <v-icon>mdi-paperclip</v-icon>
            </div>
            <div class="attachment-file-name mr-2">
              <TextStyle fontType="body-2" class="attachment-file-title" v-text="currentLesson.syllabus.title" noMargin />
            </div>
            <div @click="onDownloadSyllabus" class="cursor-pointer">
              <TextStyle fontType="body-2" class="attachment-file-download" v-text="$vuetify.lang.t('$vuetify.LEARNING.DOWNLOAD')" noMargin />
            </div>
          </div>
        </v-col>
      </v-row>
      <div style="text-align: right; margin-top: 12px">
        <DecoratorButton @click="dialog = false" variation="primary" solid>{{$vuetify.lang.t('$vuetify.CLOSE')}}</DecoratorButton>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    currentLesson: Object,
  },
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    showDialogDescription() {
      const unit = this.currentLesson
      if (unit.data && unit.data.hasAttachment)
        if (unit.syllabus || unit.description) {
          this.dialog = true
        }
    },
    onDownloadSyllabus() {
      this.$utils.onDownloadSyllabus(this.currentLesson.syllabus)
    },
  },
}
</script>
<style lang="scss" scoped>
.attachment-wrapper {
  height: 32px;
  border: 1px solid #f2f0f1;
  background-color: #f8f8f8;
  .attachment-file-name {
    max-width: 30%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .attachment-file-download {
    color: #3552ba;
    font-size: 12px;
  }
  .attachment-file-icon {
    transform: scale(0.7);
  }
  .attachment-file-title {
    color: #707070;
    font-size: 12px;
    margin-right: 18px;
  }
}
</style>
