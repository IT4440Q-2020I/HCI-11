<template>
  <v-row no-gutters class="mb-4">
    <v-col class="mb-2" cols="12">
      <TextStyle font-type="subtitle-1">{{title}}</TextStyle>
    </v-col>
    <v-col cols="12">
      <TextStyle v-if="hasDescription" font-type="body-2" class="white-space-pre-line">{{description}}</TextStyle>
      <TextStyle v-else font-type="body-2">{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.NO_DESCRIPTION')}}</TextStyle>
      <hr class="mt-3" style="opacity: .3;" />
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    title: String,
    description: String,
    hasDescription: Boolean,
  },
}
</script>
