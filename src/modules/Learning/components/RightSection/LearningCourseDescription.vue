<template>
  <div>
    <div v-if="hasDescription && description && description.length > 0" class="pa-3">
      <TextStyle font-type="body-2" class="font-weight-normal white-space-pre-line" noMargin>{{description}}</TextStyle>
    </div>
    <div v-else class="d-flex flex-column text-center align-center pt-2 pb-2">
      <v-icon color="#D2D3DB" size="54">mdi-emoticon-frown-outline</v-icon>
      <TextStyle font-type="body-1" variation="subtext" noMargin>{{$vuetify.lang.t('$vuetify.LEARNING.NO_INTRODUCTION_LESSON')}}</TextStyle>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    description: {
      type: String,
      default: '',
    },
    hasDescription: Boolean,
  },
}
</script>