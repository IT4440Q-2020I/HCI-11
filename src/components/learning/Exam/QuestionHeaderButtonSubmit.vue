<template>
  <div class="pa-3">
    <DecoratorButton
      v-if="!isEnableButtonReDo"
      @click="$emit('submit')"
      variation="primary"
      outlined
      block
      large
    >
      <span class="element text-style text-style--default subtitle-2">{{$vuetify.lang.t('$vuetify.LEARNING.SUBMIT')}}</span>
    </DecoratorButton>
    <DecoratorButton
      v-else
      v-show="!settings.submitCount && validateTime"
      @click="$emit('again')"
      variation="primary"
      outlined
      block
      large
    >
      <span class="element text-style text-style--default subtitle-2">{{$vuetify.lang.t('$vuetify.LEARNING.REDO')}}</span>
    </DecoratorButton>
  </div>
</template>
<script>
export default {
  props: {
    isEnableButtonReDo: Boolean,
    validateTime: Boolean,
    settings: Object,
  },
}
</script>