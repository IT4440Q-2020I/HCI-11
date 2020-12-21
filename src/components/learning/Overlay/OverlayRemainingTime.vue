<template>
  <div>
    <div v-if="setting.hasLimitedTime && setting.expiredTime" class="mb-2">
      <TextStyle v-if="!remainingTime " font-type="body-2">
        <span class="red--text font-weight-bold">{{$vuetify.lang.t('$vuetify.LEARNING.RUN_OUT_OF_TIME')}}</span>
      </TextStyle>
      <TextStyle
        v-else
        v-show="(!setting.submitCount || (setting.submitCount && submission.state !== 'final'))"
        font-type="body-2"
      >
        {{$vuetify.lang.t('$vuetify.LEARNING.THERE_IS_ONLY')}}
        <span class="red--text font-weight-bold">{{$vuetify.lang.t('$vuetify.DATETIME.EXACT_MINUTE', remainingTime)}}</span> {{$vuetify.lang.t('$vuetify.LEARNING.TO_DO_YOUR_TEST')}}
      </TextStyle>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    setting: Object,
    submission: Object,
  },
  computed: {
    ...mapGetters({
      remainingTime: 'unit/getRemainingTime',
    }),
  },
}
</script>
