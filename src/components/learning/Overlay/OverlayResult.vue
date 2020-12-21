<template>
  <v-row no-gutters class="mb-4">
    <v-col class="mb-2" cols="12">
      <TextStyle font-type="subtitle-1">{{$vuetify.lang.t('$vuetify.LEARNING.RESULT')}}</TextStyle>
    </v-col>
    <v-col cols="12">
      <v-row no-gutters class="wrapper-detail">
        <v-col class="detail-info d-flex flex-column" cols="12" sm="8" md="10" lg="10">
          <TextStyle
            class="mb-2"
            font-type="body-2"
          >{{$vuetify.lang.t('$vuetify.LEARNING.SUBMIT_AT')}}: {{moment(submission.submitTime).format("HH giờ mm - ss")+' giây '+moment(submission.submitTime).format("DD/MM")}}
          </TextStyle>
          <TextStyle class="mb-2" font-type="body-2">
            {{$vuetify.lang.t('$vuetify.LEARNING.DOING_DURATION')}}:
            <span>{{caculateTimeDoTest}}</span>
          </TextStyle>
        </v-col>
        <v-col class="detail-info d-flex flex-column align-end" cols="12" sm="4" md="2" lg="2">
          <TextStyle v-if="submission.state === 'final'" class="mb-2" font-type="body-2" inline>
            {{$vuetify.lang.t('$vuetify.LEARNING.MARK')}}
            <TextStyle class="ml-2" font-type="title-3" inline>{{submission.correct}}/{{submission.total}}</TextStyle>
          </TextStyle>
          <TextStyle
            v-if="!hideResult"
            @click.native="$emit('showResult')"
            class="mb-2 cursor-pointer"
            variation="primary"
            font-type="body-2"
          >{{$vuetify.lang.t('$vuetify.LEARNING.VIEW_RESULT')}}</TextStyle>
        </v-col>
      </v-row>
      <hr class="mt-2" style="opacity: .3;" />
    </v-col>
  </v-row>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    submission: Object,
    hideResult: Boolean
  },
  data () {
    return {
      moment
    }
  },
  methods: {
    millisToMinutesAndSeconds (millis) {
      var minutes = Math.floor(millis / 60000)
      var seconds = ((millis % 60000) / 1000).toFixed(0)
      return this.$vuetify.lang.t('$vuetify.LEARNING.EXACT_MINUTES_AND_SECONDS', minutes, (seconds < 10 ? '0' : '') + seconds)
    }
  },
  computed: {
    caculateTimeDoTest () {
      const startTime = moment(this.submission.startTime).valueOf()
      const endTime = moment(this.submission.submitTime).valueOf()
      const timeDoTest = endTime - startTime
      return this.millisToMinutesAndSeconds(timeDoTest)
    }
  }
}
</script>
<style lang="scss" scoped>
@media only screen and (max-width: 768px) {
  .align-end {
    justify-content: flex-start !important;
  }
}
</style>
