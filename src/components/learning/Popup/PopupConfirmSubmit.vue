<template>
  <v-dialog v-model="dialog" persistent width="350px">
    <v-card class="pa-4">
      <TextStyle noMargin>{{$vuetify.lang.t('$vuetify.LEARNING.SUBMIT_CONFIRMATION')}}</TextStyle>
      <div class="d-flex justify-space-around mt-3">
       <slot></slot>
        <DecoratorButton @click="$emit('onCancel')" variation="primary" font-type="subtitle-1" text>
          <TextStyle variation="primary" font-type="subtitle-1" noMargin>{{$vuetify.lang.t('$vuetify.CLOSE')}}</TextStyle>
        </DecoratorButton>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: Boolean
  }
}
</script>
