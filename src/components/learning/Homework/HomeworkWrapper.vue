<template>
  <div>
    <div class="border-upload rounded text-center">
      <slot name="upload-part"></slot>
    </div>
    <div class="mt-4">
      <div>
        <TextStyle
          v-if="state === 'link'"
          font-type="caption-2"
          variation="subtext"
          class="text-center"
        >{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.VIDEO_URL_HINT')}}</TextStyle>
        <TextStyle
          v-else-if="state === 'googleDrive'"
          font-type="caption-2"
          variation="subtext"
          class="text-center"
        >{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.GOOGLE_DRIVE_URL_HINT')}}</TextStyle>
        <TextStyle
          v-else
          font-type="caption-2"
          variation="subtext"
          class="text-center"
        >{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.UPLOAD_FILES_HINT')}}</TextStyle>
      </div>
      <div>
        <TextStyle
          v-if="state === 'beforeUpload'"
          font-type="caption-2"
          variation="subtext"
          class="text-center"
        >VI, MP4, MKV, WMV, MPG, 3GP, 3G2, SWF, FLV, AVCHD, WEBM, MOV, DV, RM, QT, TS, MTS, MP3, AAC, WMA, WAV, OGG</TextStyle>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    state: String,
  },
}
</script>
<style lang="scss" scoped>
.border-upload {
  border: 1px dashed #0084ff;
  box-sizing: border-box;
}
</style>
