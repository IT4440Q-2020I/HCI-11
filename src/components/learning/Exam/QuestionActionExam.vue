<template>
  <div class="test__answer-sheet__action">
    <div class="paging__navigation">
      <div @click="prevPage">
        <v-icon
          class="cursor-pointer"
          size="medium"
          color="#79797C"
        >mdi-chevron-left</v-icon>
        <!-- <ElementIcon
          class="cursor-pointer"
          name="keyboard_arrow_left"
          size="medium"
          fill="#79797C"
        ></ElementIcon> -->
      </div>
      <TextStyle
        font-type="caption-1"
        style="color: #79797C; margin-bottom: 0;"
        noMargin
      >{{page}} / {{totalPage}}</TextStyle>
      <div @click="nextPage">
        <v-icon
          class="cursor-pointer"
          size="medium"
          color="#79797C"
        >mdi-chevron-right</v-icon>
        <!-- <ElementIcon
          class="cursor-pointer"
          name="mdi-chevron-right"
          size="medium"
          fill="#79797C"
        ></ElementIcon> -->
      </div>
    </div>
    <DecoratorButton
      v-if="!isEnableButtonReDo"
      @click="$emit('submit')"
      variation="primary"
      outlined
    >{{$vuetify.lang.t('$vuetify.LEARNING.SUBMIT')}}</DecoratorButton>
    <DecoratorButton
      v-else
      v-show="!settings.submitCount && validateTime"
      @click="executeAgain"
      variation="primary"
      outlined
    >{{$vuetify.lang.t('$vuetify.LEARNING.REDO')}}</DecoratorButton>
  </div>
</template>
<script>
export default {
  props: {
    page: Number,
    totalPage: Number,
    isEnableButtonReDo: Boolean,
    validateTime: Boolean,
    settings: Object,
  },
  data() {
    return {}
  },
  methods: {
    executeAgain() {
      this.$emit('excuteAgain')
    },
    prevPage() {
      this.$emit('prevPage')
    },
    nextPage() {
      this.$emit('nextPage')
    },
  },
}
</script>
<style lang="scss" scoped>
.test__answer-sheet__action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  .paging__navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #79797c;
    width: 88px;
    height: 24px;
    border-radius: 24px;
  }
}
</style>