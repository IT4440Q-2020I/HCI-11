<template>
  <v-row no-gutters class="question">
    <v-col cols="2" v-if="!hasHtml" class="text-left">
      <TextStyle font-type="body-1 text-left" noMargin>{{index + 1}}</TextStyle>
    </v-col>
    <v-col cols="10" :class="`text-left d-flex question__answers ${hasHtml ? 'flex-column' : ''}`">
      <div
        :class="`question__answer ${hasHtml ? 'vertical-selections mb-4' : ''}`"
        v-for="(key, j) in Object.keys(selections)"
        :key="j"
      >
        <div
          v-if="!showResult"
          :class="`question__answer__label ${value === key ? 'active' : ''}`"
          :style="`background-color: ${value === key ? $themeData.color_primary : '#FAFBFC'}`"
          @click="selectAnswer(key)"
        >
          <TextStyle class="headline" noMargin>{{selections[key].label}}</TextStyle>
        </div>
        <div v-else :style="genLabelStyleShowResult(key,value)" class="question__answer__label">
          <TextStyle :style="genTextStyleShowResult(key,value)" noMargin>{{selections[key].label}}</TextStyle>
        </div>
        <div v-if="hasHtml">
          <div v-html="selections[key].value"></div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    isShowResult: Boolean,
    index: Number,
    selections: Object,
    value: String,
    correct: String,
    hasHtml: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showResult: false,
    }
  },
  methods: {
    genLabelStyleShowResult(answerId, selection) {
      if (answerId === selection) {
        if (this.correct === selection) {
          return `background-color: #4BCA81`
        } else {
          return `background-color: #D4504C`
        }
      } else {
        if (this.correct === answerId) {
          return 'box-shadow: 0 0 0 1px #4BCA81;'
        }
      }
    },
    genTextStyleShowResult(answerId, selection) {
      if (answerId === selection) {
        return 'color: white;'
      } else {
        if (this.correct === answerId) {
          return 'color: #4BCA81'
        }
      }
    },
    selectAnswer(key) {
      this.$emit('input', key)
      this.$emit('synchronize')
    },
  },
  watch: {
    isShowResult: {
      handler(isShowResult) {
        this.showResult = isShowResult
      },
      immediate: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.question {
  display: flex;
  align-items: center;
  .question__answers {
    .vertical-selections {
      display: inline-flex !important;
      align-items: center;
    }
    .question__answer {
      display: inline-block;
      .question__answer__label {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px !important;
        height: 24px;
        border-radius: 50%;
        background: #fafbfc;
        box-shadow: 0 0 0 1px #dddbda;
        margin-right: 12px;
        vertical-align: top;
        cursor: pointer;
        .headline {
          font-size: 14px !important;
        }
        &.active {
          .headline {
            color: #fff;
          }
        }
      }
      @media only screen and (max-width: 960px) {
        .question__answer__label {
          min-width: 40px !important;
          min-height: 40px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
::v-deep .ql-container.ql-snow .ql-editor p {
  margin: 0;
}
</style>