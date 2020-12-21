<template>
  <div class="wrapper-content d-flex flex-column justify-center align-center pa-4">
    <div v-for="file in fileUploaded" :key="file.title" class="file-interaction rounded pa-2 mb-3">
      <v-row no-gutters>
        <v-col class="d-flex" cols="6" md="6" lg="8">
          <v-icon class="grey--text mr-1">mdi-file-document-outline</v-icon>
          <TextStyle class="file-title text-left ellipsis-one-line" font-type="caption-2" variation="subtext" noMargin>{{file.title}}</TextStyle>
        </v-col>
        <v-col class="d-flex justify-end" cols="6" md="6" lg="4">
          <v-icon class="grey--text">mdi-download</v-icon>
          <v-icon class="grey--text">mdi-delete-outline</v-icon>
        </v-col>
      </v-row>
    </div>
    <div class="mt-2">
      <DecoratorButton
        @click="$emit('reSubmit')"
        class="button-resubmit mr-2"
        variation="secondary"
        text
      >{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.SWITCH_FILES_TO_SUBMIT')}}</DecoratorButton>
      <DecoratorButton @click="$emit('confirm')" variation="primary">{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.CONFIRM_SUBMIT')}}</DecoratorButton>
    </div>
    <TextStyle
      class="mt-2"
      font-type="caption-2"
    >{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.RESUBMIT_WARNING')}}</TextStyle>
  </div>
</template>
<script>
export default {
  props: {
    fileUploaded: Array,
  },
}
</script>
<style lang="scss" scoped>
.file-icon {
  width: 15px;
}
.button-resubmit {
  border: 1px solid #dddbda;
  color: #79797c;
}
.wrapper-content {
  .file-interaction {
    width: 500px;
    border: 1px solid #dddbda;
  }
}
</style>
