<template>
  <div class="pa-5">
    <TextStyle font-type="caption-2" variation="default" class="text-center">{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.COPY_AND_PASTE_LINK_HERE')}}:</TextStyle>
    <Input class="mt-2 mb-2" v-model="link" placeholder="https://www.youtube.com/" />
    <DecoratorButton
      class="mt-2"
      @click="$emit('confirm', link)"
      variation="primary"
      solid
    >{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.CONFIRM_SUBMIT')}}</DecoratorButton>
  </div>
</template>
<script>
export default {
  data () {
    return {
      link: null
    }
  }
}
</script>
