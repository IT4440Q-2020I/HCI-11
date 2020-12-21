<template>
  <v-row no-gutters class="mb-4">
    <v-col class="mb-2" cols="12">
      <TextStyle font-type="subtitle-1">{{$vuetify.lang.t('$vuetify.LEARNING.RULES')}}</TextStyle>
    </v-col>
    <v-col v-if="setting" cols="12">
      <v-row no-gutters class="wrapper-detail rounded pa-4">
        <v-col class="d-flex flex-column" cols="12" sm="12" md="8" lg="10">
          <TextStyle class="mb-2" font-type="body-2">{{$vuetify.lang.t('$vuetify.LEARNING.TIME')}}:</TextStyle>
          <div class="d-flex flex-column" v-if="setting.hasRangeTime">
            <TextStyle
              class="mb-2"
              font-type="body-2"
            >{{$vuetify.lang.t('$vuetify.LEARNING.ALLOW_START_FROM')}}: {{ setting.rangeTimeFromHour }}, {{ moment(setting.rangeTimeFromDate).format("DD/MM") }}</TextStyle>
            <TextStyle
              class="mb-2"
              font-type="body-2"
            >{{$vuetify.lang.t('$vuetify.LEARNING.END_AT')}}: {{ setting.rangeTimeToHour }}, {{ moment(setting.rangeTimeToDate).format("DD/MM") }}</TextStyle>
            <TextStyle
              class="mb-2 red--text font-weight-bold"
              font-type="body-2"
            >{{$vuetify.lang.t('$vuetify.LEARNING.NOT_IN_ALLOWANCE_TIME_AND_TRY_AGAIN')}}</TextStyle>
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
    setting: Object,
  },
  data() {
    return {
      moment,
    }
  },
}
</script>
<style lang="scss" scoped>
.wrapper-detail {
  background: rgba(0, 132, 255, 0.08);
}
</style>
