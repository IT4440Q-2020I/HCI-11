<template>
  <v-dialog v-model="dialog" width="500px">
    <v-card class="pa-4">
      <TextStyle>{{$vuetify.lang.t('$vuetify.LEARNING.SUBMIT_WARNING')}}</TextStyle>
      <div class="text-right mt-3">
        <DecoratorButton @click="$emit('onCancel')" variation="primary" solid>{{$vuetify.lang.t('$vuetify.CLOSE')}}</DecoratorButton>
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
