<template>
  <v-row no-gutters class="mb-4">
    <v-col class="mb-2" cols="12">
      <TextStyle font-type="subtitle-1">{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.DEADLINE')}}</TextStyle>
    </v-col>
    <v-col v-if="settings" cols="12">
      <v-row no-gutters class="wrapper-detail rounded pa-4">
        <v-col class="d-flex flex-column" cols="12" sm="12" md="8" lg="10">
          <TextStyle font-type="body-2" noMargin>
            <span v-if="!settings.submitCount">
              {{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.CAN')}}
              <span class="red--text font-weight-bold">{{$vuetify.lang.t('$vuetify.LEARNING.SUBMIT_MULTIPLE')}}</span>
            </span>
            <span v-else>
              {{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.CAN_ONLY')}}
              <span class="red--text font-weight-bold">{{$vuetify.lang.t('$vuetify.LEARNING.ONCE')}}</span> {{$vuetify.lang.t('$vuetify.LEARNING.ONLY')}}
            </span>
          </TextStyle>
          <div class="d-flex flex-column mt-1" v-if="settings.hasRangeTime">
            <TextStyle
              class="mb-1"
              font-type="body-2"
              noMargin
            >{{$vuetify.lang.t('$vuetify.LEARNING.ALLOW_START_FROM')}}: {{ settings.rangeTimeFromHour }}, {{ moment(settings.rangeTimeFromDate).format("DD/MM") }}</TextStyle>
            <TextStyle
              class="mb-1"
              font-type="body-2"
              noMargin
            >{{$vuetify.lang.t('$vuetify.LEARNING.MUST_SUBMIT_BEFORE')}}: {{ settings.rangeTimeToHour }}, {{ moment(settings.rangeTimeToDate).format("DD/MM") }}</TextStyle>
            <TextStyle
              v-if="!validateTime"
              class="red--text font-weight-bold"
              font-type="body-2"
              noMargin
            >{{$vuetify.lang.t('$vuetify.LEARNING.NOT_RIGHT_TIME_SUBMIT')}}</TextStyle>
          </div>
        </v-col>
      </v-row>
      <hr class="mt-4" style="opacity: .3;" />
    </v-col>
  </v-row>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    settings: Object,
  },
  data() {
    return {
      moment,
    }
  },
  computed: {
    validateTime() {
      const settings = this.settings
      if (settings.hasRangeTime) {
        const timeZone = moment().valueOf()
        const startTime = moment(
          `${settings.rangeTimeFromDate}T${settings.rangeTimeFromHour}:00.000+07:00`
        ).valueOf()
        const endTime = moment(
          `${settings.rangeTimeToDate}T${settings.rangeTimeToHour}:00.000+07:00`
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
  .remaining-time {
    color: red;
  }
}
@media only screen and (max-width: 760px) {
  .align-end {
    display: grid !important;
  }
}
</style>
