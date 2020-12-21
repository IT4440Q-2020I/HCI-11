<template>
  <div class="pa-5">
    <img src="/img/icons/bx_bx-check-circle.svg" alt />
    <div class="d-flex flex-column align-center">
      <TextStyle
        font-type="body-2"
        variation="subtext"
      >{{$vuetify.lang.t('$vuetify.LEARNING.SUBMITTED_FILES')}}</TextStyle>
      <TextStyle font-type="body-2" variation="subtext">{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.PLEASE_WAIT_FOR_NOTE_FROM_TEACHER')}}</TextStyle>
    </div>
    <DecoratorButton
      v-if="!unit.settings.submitCount"
      @click="$emit('reSubmit')"
      class="mt-2"
      variation="primary"
      solid
    >{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.RESUBMIT')}}</DecoratorButton>
  </div>
</template>
<script>
export default {
  props: {
    unit: Object,
  },
}
</script>
