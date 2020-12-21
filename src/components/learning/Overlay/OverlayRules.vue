<template>
  <v-row no-gutters class="mb-4">
    <v-col class="mb-2" cols="12">
      <TextStyle font-type="subtitle-1">{{$vuetify.lang.t('$vuetify.LEARNING.RULES')}}</TextStyle>
    </v-col>
    <v-col v-if="setting" cols="12">
      <v-row no-gutters class="wrapper-detail rounded pa-4">
        <v-col class="d-flex flex-column" cols="12" sm="12" md="8" lg="10">
          <TextStyle font-type="body-2" noMargin>
            <span class="mr-1">{{$vuetify.lang.t('$vuetify.LEARNING.TIME')}}:</span>
            <span v-if="setting.hasLimitedTime">{{$vuetify.lang.t('$vuetify.DATETIME.EXACT_MINUTE', setting.expiredTime)}}</span>
            <span v-else>{{$vuetify.lang.t('$vuetify.LEARNING.NO_LIMIT')}}</span>
            <span v-if="setting.submitCount">
              / {{$vuetify.lang.t('$vuetify.LEARNING.SUBMIT_COUNT')}}:
              <span class="red--text font-weight-bold">{{$vuetify.lang.t('$vuetify.LEARNING.ONCE')}}</span> {{$vuetify.lang.t('$vuetify.LEARNING.ONLY')}}
            </span>
          </TextStyle>
          <div class="my-1" v-if="setting.hasRangeTime">
            <TextStyle
              class="mb-1"
              font-type="body-2"
              noMargin
            >{{$vuetify.lang.t('$vuetify.LEARNING.ALLOW_START_FROM')}}: {{ setting.rangeTimeFromHour }}, {{ moment(setting.rangeTimeFromDate).format("DD/MM") }}</TextStyle>
            <TextStyle
              class="mb-1"
              font-type="body-2"
              noMargin
            >{{$vuetify.lang.t('$vuetify.LEARNING.MUST_SUBMIT_BEFORE')}}: {{ setting.rangeTimeToHour }}, {{ moment(setting.rangeTimeToDate).format("DD/MM") }}</TextStyle>
            <TextStyle
              v-if="!validateTime"
              class="red--text font-weight-bold"
              font-type="body-2"
              noMargin
            >{{$vuetify.lang.t('$vuetify.LEARNING.NOT_RIGHT_TIME_SUBMIT')}}</TextStyle>
          </div>
        </v-col>
        <v-col v-if="validateTime" class="d-flex flex-column align-end" cols="12" sm="12" md="4" lg="2">
          <OverlayRemainingTime ref="remaining-time" :setting="setting" :submission="submission" />
          <div
            v-if="!submission.state || (submission.state && submission.state === 'final' && !setting.submitCount)"
            class="d-flex flex-column align-end"
          >
            <DecoratorButton
              style="margin: 0px;"
              variation="primary"
              @click="$emit('startTest')"
            >{{$vuetify.lang.t('$vuetify.LEARNING.START_DOING')}}</DecoratorButton>
          </div>
          <div
            v-else-if="submission.state && submission.state === 'started' ||submission.state === 'doing'"
            class="d-flex flex-column align-end"
          >
            <DecoratorButton
              variation="primary"
              style="margin: 0px;"
              @click="$emit('continueTest')"
            >{{$vuetify.lang.t('$vuetify.LEARNING.CONTINUE_DOING')}}</DecoratorButton>
          </div>
        </v-col>
      </v-row>
      <hr class="mt-4" style="opacity: .3;" />
    </v-col>
  </v-row>
</template>
<script>
import moment from 'moment'
import OverlayRemainingTime from '@/components/learning/Overlay/OverlayRemainingTime'
export default {
  components: {
    OverlayRemainingTime,
  },
  props: {
    setting: Object,
    submission: Object,
  },
  data() {
    return {
      moment,
    }
  },
  computed: {
    validateTime() {
      const setting = this.setting
      if (setting.hasRangeTime) {
        const timeZone = moment().valueOf()
        const startTime = moment(
          `${setting.rangeTimeFromDate}T${setting.rangeTimeFromHour}:00.000+07:00`
        ).valueOf()
        const endTime = moment(
          `${setting.rangeTimeToDate}T${setting.rangeTimeToHour}:00.000+07:00`
        ).valueOf()
        return timeZone > startTime && timeZone < endTime
      } else return true
    },
  },
}
</script>
<style lang="scss" scoped>
.wrapper-detail {
  background: rgba(0, 132, 255, 0.08);
  .align-end {
    justify-content: flex-end;
  }
}
@media only screen and (max-width: 760px) {
  .align-end {
    display: grid !important;
  }
}
</style>
