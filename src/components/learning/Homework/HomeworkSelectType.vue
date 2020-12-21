<template>
  <div class="wrapper-select d-flex justify-center">
    <DecoratorButton @click="$emit('changeTypeUpload', 'beforeUpload')" variation="primary" text>
      <ElementIcon class="mr-2" size="small" name="unit-type-upload" />{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.UPLOAD_FILES')}}
    </DecoratorButton>
    <DecoratorButton @click="$emit('changeTypeUpload', 'link')" variation="primary" text>
      <ElementIcon class="mr-2" size="small" name="unit-type-video" />{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.VIDEO_URL')}}
    </DecoratorButton>
    <DecoratorButton @click="$emit('changeTypeUpload', 'googleDrive')" variation="primary" text>
      <v-icon>mdi-chevron-right</v-icon>{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.GOOGLE_DRIVE_URL')}}
    </DecoratorButton>
  </div>
</template>
<style lang="scss" scoped>
@media only screen and (max-width: 600px) {
  .wrapper-select {
    flex-direction: column;
  }
}
</style>
